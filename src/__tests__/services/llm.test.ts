import { CodeAnalysisService } from "@/services/llm";
import { CommitInfo } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const mockGenerateContent = jest.fn().mockResolvedValue({
  response: {
    text: () => "Mock response text",
  },
});

const mockGetGenerativeModel = jest.fn().mockReturnValue({
  generateContent: mockGenerateContent,
});

const mockGenAI = {
  getGenerativeModel: mockGetGenerativeModel,
};

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => mockGenAI),
}));

describe("CodeAnalysisService", () => {
  let service: CodeAnalysisService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CodeAnalysisService(
      mockGenAI as unknown as GoogleGenerativeAI,
    );
  });

  describe("analyzeFile", () => {
    // Test basic file analysis functionality
    it("should format and return the response correctly", async () => {
      const result = await service.analyzeFile(
        "console.log('test')",
        "concise",
      );
      expect(result).toBe("Mock response text");
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({
        model: "gemini-2.0-flash",
        generationConfig: expect.any(Object),
      });
    });

    // Test progress reporting during file analysis
    it("should call onProgress with correct progress values", async () => {
      const onProgress = jest.fn();
      await service.analyzeFile("const x = 1;", "concise", onProgress);

      expect(onProgress).toHaveBeenCalledTimes(3);
      expect(onProgress).toHaveBeenNthCalledWith(1, 25);
      expect(onProgress).toHaveBeenNthCalledWith(2, 30);
      expect(onProgress).toHaveBeenNthCalledWith(3, 80);
    });

    // Test error handling for file analysis
    it("should handle API errors gracefully", async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error("API Error"));

      await expect(
        service.analyzeFile("const x = 1;", "detailed"),
      ).rejects.toThrow("Unable to process response");
    });
  });

  describe("analyzeCommit", () => {
    const mockCommitInfo: CommitInfo = {
      message: "feat: add new feature",
      author: "Test User",
      date: "2024-01-01",
      changes: [
        {
          filename: "test.ts",
          changes: "Added new function",
          patch: "+ function test() { return true; }",
        },
      ],
    };

    // Test basic commit analysis functionality
    it("should analyze commit content correctly", async () => {
      const result = await service.analyzeCommit(
        mockCommitInfo,
        "comprehensive",
      );

      expect(result).toBe("Mock response text");
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining(mockCommitInfo.message),
      );
    });

    // Test that all commit information is included in the analysis request
    it("should include all commit details in the analysis template", async () => {
      await service.analyzeCommit(mockCommitInfo, "comprehensive");

      const templateCall = mockGenerateContent.mock.calls[0][0] as string;

      expect(templateCall).toContain(mockCommitInfo.message);
      expect(templateCall).toContain(mockCommitInfo.author);
      expect(templateCall).toContain(mockCommitInfo.date);
      expect(templateCall).toContain(mockCommitInfo.changes[0].filename);
      expect(templateCall).toContain(mockCommitInfo.changes[0].patch);
    });

    // Test progress reporting during commit analysis
    it("should call onProgress with correct values", async () => {
      const onProgress = jest.fn();
      await service.analyzeCommit(mockCommitInfo, "comprehensive", onProgress);

      expect(onProgress).toHaveBeenCalledTimes(3);
      expect(onProgress).toHaveBeenNthCalledWith(1, 25);
      expect(onProgress).toHaveBeenNthCalledWith(2, 30);
      expect(onProgress).toHaveBeenNthCalledWith(3, 90);
    });

    // Test error handling for commit analysis
    it("should handle API errors during commit analysis", async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error("API Error"));

      await expect(
        service.analyzeCommit(mockCommitInfo, "comprehensive"),
      ).rejects.toThrow("Unable to process response");
    });
  });
});
