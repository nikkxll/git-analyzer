import { Octokit } from "@octokit/core";
import { CodeAnalysisService } from "./llm";
import { FeedbackSize, CommitInfo, GitHubFile } from "@/types";

/**
 * Service for interacting with GitHub API and analyzing repository content.
 *
 * @remarks
 * This service provides methods to fetch and analyze GitHub repository content,
 * including individual files or commit details. It uses the Octokit client for
 * GitHub API interactions and CodeAnalysisService for content analysis with help of LLM API.
 *
 * @example
 * ```typescript
 * const githubService = new GitHubService();
 * const analysis = await githubService.getFileAnalysis(owner, repoName, sha, feedbackSize);
 * ```
 * or
 * ```typescript
 * const analysis = await githubService.getCommitAnalysis(owner, repoName, sha, feedbackSize);
 * ```
 */
export class GitHubService {
  private octokit: Octokit;
  private codeAnalysis: CodeAnalysisService;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    this.codeAnalysis = new CodeAnalysisService();
  }

  /**
   * Fetches and analyzes the content of a specific file from a GitHub repository.
   * 
   * @remarks
   * This method performs the following steps:
   * 1. Fetches the file content from GitHub
   * 2. Decodes the base64 content
   * 3. Analyzes the code using CodeAnalysisService class methods
   * 
   * @param owner - The GitHub username
   * @param repo - The name of the repository
   * @param fileSha - The SHA hash of the file
   * @param FeedbackSize - The desired level of detail in the analysis
   * @param onProgress - Optional callback function to track loading progress
   * 
   * @returns A Promise that resolves to the analysis result as a string
   * 
   * @throws {Error} When file content cannot be fetched or accessed
   */
  async getFileAnalysis(
    owner: string,
    repo: string,
    fileSha: string,
    FeedbackSize: FeedbackSize,
    onProgress?: (progress: number) => void
  ): Promise<string> {
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
      const content = Buffer.from(response.data.content, "base64").toString(
        "utf-8"
      );

      onProgress?.(20);
      const analysis = await this.codeAnalysis.analyzeFile(
        content,
        FeedbackSize,
        onProgress
      );

      onProgress?.(95);
      return analysis;
    } catch {
      throw new Error(
        "Error fetching file content. Make sure it is accessible."
      );
    }
  }

  /**
   * Fetches and analyzes details of a specific commit from a GitHub repository.
   * 
   * @remarks
   * This method:
   * 1. Retrieves commit information
   * 2. Formats the commit data into a structured format
   * 3. Analyzes the commit using CodeAnalysisService class methods
   * 
   * @param owner - The GitHub username
   * @param repoName - The name of the repository
   * @param sha - The SHA hash of the file
   * @param FeedbackSize - The desired level of detail in the analysis
   * @param onProgress - Optional callback function to track loading progress
   * 
   * @returns A Promise that resolves to the commit analysis result as a string
   * 
   * @throws {Error} When commit details cannot be fetched or accessed
   */
  async getCommitAnalysis(
    owner: string,
    repoName: string,
    sha: string,
    FeedbackSize: FeedbackSize,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      onProgress?.(5);
      const response = await this.octokit.request(
        "GET /repos/{owner}/{repo}/commits/{sha}",
        {
          owner,
          repo: repoName,
          sha,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      onProgress?.(10);

      const files = response.data.files || [];

      const commitInfo: CommitInfo = {
        message: response.data.commit.message,
        author: response.data.commit.author.name,
        date: response.data.commit.author.date,
        changes: files.map((file: GitHubFile) => ({
          filename: file.filename,
          changes: `${file.additions} additions, ${file.deletions} deletions`,
          patch: file.patch,
        })),
      };

      onProgress?.(20);
      
      const analysis = await this.codeAnalysis.analyzeCommit(
        commitInfo,
        FeedbackSize,
        onProgress
      );
      onProgress?.(95);

      return analysis;
    } catch {
      throw new Error(
        "Error fetching commit details. Make sure it is accessible"
      );
    }
  }
}
