import { Octokit } from "@octokit/core";
import { CodeAnalysisService } from './llm';
import { FeedbackSize, CommitInfo } from '@/types';

export class GitHubService {
  private octokit: Octokit;
  private codeAnalysis: CodeAnalysisService;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    this.codeAnalysis = new CodeAnalysisService();
  }

  async getFileContent(
    owner: string,
    repo: string,
    fileSha: string,
    FeedbackSize: FeedbackSize,
    onProgress?: (progress: number) => void,
  ):  Promise<string>  {
    try {
      onProgress?.(5);
      const response = await this.octokit.request(
        "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
        {
          owner,
          repo,
          file_sha: fileSha,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      onProgress?.(10);
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');

      onProgress?.(20);
      const analysis = await this.codeAnalysis.analyzeCode(content, FeedbackSize, onProgress);

      onProgress?.(95);
      return analysis;
    } catch (error) {
      throw new Error('Error fetching file content. Make sure the file is accessible.');
    }
  }

  async getCommitDetails(
    owner: string,
    repoName: string,
    sha: string,
    FeedbackSize: FeedbackSize,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      onProgress?.(20);
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/commits/{sha}', {
        owner,
        repo: repoName,
        sha,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      onProgress?.(40);

      // Get the files changed in this commit
      const files = response.data.files || [];

      const commitInfo: CommitInfo = {
        message: response.data.commit.message,
        author: response.data.commit.author.name,
        date: response.data.commit.author.date,
        changes: files.map((file: any) => ({
          filename: file.filename,
          changes: `${file.additions} additions, ${file.deletions} deletions`,
          patch: file.patch
        }))
      };

      onProgress?.(60);

      const analysis = await this.codeAnalysis.analyzeCommit(
        commitInfo,
        FeedbackSize,
        onProgress
      );

      return analysis;
    } catch (error) {
      throw new Error('Error fetching commit details. Make sure the commit is accessible');
    }
  }
}
