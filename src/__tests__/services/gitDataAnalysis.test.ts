import { GitHubService } from "@/services/gitDataAnalysis";
import { CodeAnalysisService } from "@/services/llm";
import { Octokit } from "@octokit/core";
import { FeedbackSize, CommitInfo } from "@/types";

type MockedOctokit = {
  request: jest.MockedFunction<typeof Octokit.prototype.request>;
};

jest.mock("@octokit/core", () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    request: jest.fn(),
  })),
}));

jest.mock("../../services/llm", () => ({
  CodeAnalysisService: jest.fn().mockImplementation(() => ({
    analyzeFile: jest.fn().mockResolvedValue("Mocked analysis result"),
    analyzeCommit: jest.fn().mockResolvedValue("Mocked commit analysis"),
  })),
}));

describe("GitHubService", () => {
  let service: GitHubService;
  let mockOctokit: MockedOctokit;
  let mockCodeAnalysis: jest.Mocked<CodeAnalysisService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GitHubService();

    mockOctokit = (Octokit as jest.MockedClass<typeof Octokit>).mock.results[0]
      .value as MockedOctokit;
    mockCodeAnalysis = (
      CodeAnalysisService as jest.MockedClass<typeof CodeAnalysisService>
    ).mock.results[0].value;
  });

  describe("getFileAnalysis", () => {
    const mockParams = {
      owner: "test owner",
      repo: "test repo",
      fileSha: "test sha",
      FeedbackSize: "concise" as FeedbackSize,
      onProgress: jest.fn(),
    };

    const mockFileResponse = {
      data: {
        content: Buffer.from("test content").toString("base64"),
      },
      headers: {},
      status: 200,
      url: "",
    };

    it("should fetch and analyze file content successfully", async () => {
      mockOctokit.request.mockResolvedValueOnce(mockFileResponse);

      const result = await service.getFileAnalysis(
        mockParams.owner,
        mockParams.repo,
        mockParams.fileSha,
        mockParams.FeedbackSize,
        mockParams.onProgress,
      );

      expect(mockOctokit.request).toHaveBeenCalledWith(
        "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
        expect.objectContaining({
          owner: mockParams.owner,
          repo: mockParams.repo,
          file_sha: mockParams.fileSha,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }),
      );

      expect(mockCodeAnalysis.analyzeFile).toHaveBeenCalledWith(
        "test content",
        mockParams.FeedbackSize,
        mockParams.onProgress,
      );

      expect(result).toBe("Mocked analysis result");
    });

    it("should call progress callback with correct values", async () => {
      mockOctokit.request.mockResolvedValueOnce(mockFileResponse);

      await service.getFileAnalysis(
        mockParams.owner,
        mockParams.repo,
        mockParams.fileSha,
        mockParams.FeedbackSize,
        mockParams.onProgress,
      );

      expect(mockParams.onProgress).toHaveBeenCalledWith(5);
      expect(mockParams.onProgress).toHaveBeenCalledWith(10);
      expect(mockParams.onProgress).toHaveBeenCalledWith(20);
      expect(mockParams.onProgress).toHaveBeenCalledWith(95);
    });

    it("should throw error when file fetch fails", async () => {
      mockOctokit.request.mockRejectedValueOnce(new Error("API Error"));

      await expect(
        service.getFileAnalysis(
          mockParams.owner,
          mockParams.repo,
          mockParams.fileSha,
          mockParams.FeedbackSize,
          mockParams.onProgress,
        ),
      ).rejects.toThrow(
        "Error fetching file content. Make sure it is accessible.",
      );
    });
  });

  describe("getCommitAnalysis", () => {
    const mockParams = {
      owner: "testOwner",
      repoName: "testRepo",
      sha: "testSha",
      FeedbackSize: "concise" as FeedbackSize,
      onProgress: jest.fn(),
    };

    const mockCommitResponse = {
      data: {
        commit: {
          message: "test commit",
          author: {
            name: "Test Author",
            date: "2024-01-01T00:00:00Z",
          },
        },
        files: [
          {
            filename: "test.ts",
            additions: 10,
            deletions: 5,
            patch: "@@ -1,3 +1,8 @@",
          },
        ],
      },
      headers: {},
      status: 200,
      url: "",
    };

    it("should fetch and analyze commit details successfully", async () => {
      mockOctokit.request.mockResolvedValueOnce(mockCommitResponse);

      const result = await service.getCommitAnalysis(
        mockParams.owner,
        mockParams.repoName,
        mockParams.sha,
        mockParams.FeedbackSize,
        mockParams.onProgress,
      );

      expect(mockOctokit.request).toHaveBeenCalledWith(
        "GET /repos/{owner}/{repo}/commits/{sha}",
        expect.objectContaining({
          owner: mockParams.owner,
          repo: mockParams.repoName,
          sha: mockParams.sha,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }),
      );

      const expectedCommitInfo: CommitInfo = {
        message: "test commit",
        author: "Test Author",
        date: "2024-01-01T00:00:00Z",
        changes: [
          {
            filename: "test.ts",
            changes: "10 additions, 5 deletions",
            patch: "@@ -1,3 +1,8 @@",
          },
        ],
      };

      expect(mockCodeAnalysis.analyzeCommit).toHaveBeenCalledWith(
        expectedCommitInfo,
        mockParams.FeedbackSize,
        mockParams.onProgress,
      );

      expect(result).toBe("Mocked commit analysis");
    });

    it("should call progress callback with correct values", async () => {
      mockOctokit.request.mockResolvedValueOnce(mockCommitResponse);

      await service.getCommitAnalysis(
        mockParams.owner,
        mockParams.repoName,
        mockParams.sha,
        mockParams.FeedbackSize,
        mockParams.onProgress,
      );

      expect(mockParams.onProgress).toHaveBeenCalledWith(5);
      expect(mockParams.onProgress).toHaveBeenCalledWith(10);
      expect(mockParams.onProgress).toHaveBeenCalledWith(20);
      expect(mockParams.onProgress).toHaveBeenCalledWith(95);
    });

    it("should throw error when commit fetch fails", async () => {
      mockOctokit.request.mockRejectedValueOnce(new Error("API Error"));

      await expect(
        service.getCommitAnalysis(
          mockParams.owner,
          mockParams.repoName,
          mockParams.sha,
          mockParams.FeedbackSize,
          mockParams.onProgress,
        ),
      ).rejects.toThrow(
        "Error fetching commit details. Make sure it is accessible",
      );
    });

    it("should handle missing files array in response", async () => {
      const responseWithoutFiles = {
        data: {
          commit: {
            message: "test commit",
            author: {
              name: "Test Author",
              date: "2024-01-01T00:00:00Z",
            },
          },
        },
        headers: {},
        status: 200,
        url: "",
      };

      mockOctokit.request.mockResolvedValueOnce(responseWithoutFiles);

      const result = await service.getCommitAnalysis(
        mockParams.owner,
        mockParams.repoName,
        mockParams.sha,
        mockParams.FeedbackSize,
        mockParams.onProgress,
      );

      expect(mockCodeAnalysis.analyzeCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: [],
        }),
        mockParams.FeedbackSize,
        mockParams.onProgress,
      );

      expect(result).toBe("Mocked commit analysis");
    });
  });
});
