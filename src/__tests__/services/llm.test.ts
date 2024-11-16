import { CodeAnalysisService } from "@/services/llm";
import { CommitInfo } from "@/types";

jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: jest.fn().mockReturnValue("Mock response text"),
            },
          }),
        }),
      };
    }),
  };
});

describe("CodeAnalysisService", () => {
  let service: CodeAnalysisService;
  beforeEach(() => {
    service = new CodeAnalysisService();
  });

  it("should format the response correctly", async () => {
    const result = await service.analyzeFile("Mock string", "concise");
    expect(result).toBe("Mock response text");
  });

  it("should call onProgress with the correct values during code analysis", async () => {
    const onProgress = jest.fn();
    await service.analyzeFile("Mock string", "concise", onProgress);

    expect(onProgress).toHaveBeenCalledWith(25);
    expect(onProgress).toHaveBeenCalledWith(30);
    expect(onProgress).toHaveBeenCalledWith(80);
  });

  it("should handle errors in model creation indirectly through public methods", async () => {
    type ServiceType = CodeAnalysisService & {
      createModel: () => unknown;
    };

    jest.spyOn(service as ServiceType, "createModel").mockImplementation(() => {
      throw new Error("Mock error");
    });

    await expect(
      service.analyzeFile("Mock string", "detailed"),
    ).rejects.toThrow("Unable to process response");
  });

  it("should call onProgress with correct values during commit analysis", async () => {
    const commitInfo: CommitInfo = {
      message: "init commit",
      author: "Test User",
      date: "2024-01-01",
      changes: [
        {
          filename: "test.js",
          changes: "Added debug statement",
          patch: '+ console.log("logging for test");',
        },
      ],
    };

    const onProgress = jest.fn();
    const result = await service.analyzeCommit(
      commitInfo,
      "comprehensive",
      onProgress,
    );
    expect(result).toBe("Mock response text");
    expect(onProgress).toHaveBeenCalledWith(30);
    expect(onProgress).toHaveBeenCalledWith(90);
  });

  it("should call generateContent with the correct template during commit analysis", async () => {
    const commitInfo: CommitInfo = {
      message: "init commit",
      author: "Test User",
      date: "2024-01-01",
      changes: [
        {
          filename: "test.js",
          changes: "Added debug statement",
          patch: '+ console.log("logging for test");',
        },
      ],
    };

    const generateContentSpy = jest.spyOn(service["model"], "generateContent");

    await service.analyzeCommit(commitInfo, "comprehensive");

    expect(generateContentSpy).toHaveBeenCalledWith(
      expect.stringContaining("init commit"),
    );
    expect(generateContentSpy).toHaveBeenCalledWith(
      expect.stringContaining("Test User"),
    );
    expect(generateContentSpy).toHaveBeenCalledWith(
      expect.stringContaining("test.js"),
    );
  });
});
