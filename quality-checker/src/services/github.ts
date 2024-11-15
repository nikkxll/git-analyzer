import { Octokit } from "@octokit/core";
import { CodeAnalysisService } from './llm';
import { FeedbackSize } from '@/types';

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
  ):  Promise<string>  {
    try {
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

      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      const analysis = await this.codeAnalysis.analyzeCode(content, FeedbackSize);

      return analysis;
    } catch (error) {
      console.error("Error fetching file:", error);
      throw error;
    }
  }
}
