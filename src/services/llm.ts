import { GoogleGenerativeAI } from "@google/generative-ai";
import { FeedbackSize, CommitInfo } from "@/types";
import {
  REVIEW_TEMPLATES,
  COMMIT_TEMPLATES,
  TOKEN_LIMITS,
} from "../constants/feedback";

/**
 * Service for analyzing code and commits using Google's Generative AI.
 *
 * @remarks
 * This service utilizes Google's Gemini Pro model to provide automated file reviews
 * and commit analysis. It supports different levels of analysis detail through
 * configurable feedback sizes.
 *
 * @example
 * ```typescript
 * const analysisService = new CodeAnalysisService();
 * const analysis = await analysisService.analyzeFile(content, feedbackSize)
 * ```
 * or
 * ```typescript
 * const analysis = await analysisService.analyzeCommit(content, feedbackSize)
 * ```
 */
export class CodeAnalysisService {
  constructor(
    private readonly genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!,
    ),
  ) {}

  private createModel(tokenLimit: number) {
    return this.genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        maxOutputTokens: tokenLimit,
      },
    });
  }

  private formatResponse(text: string): string {
    return text.replace(/\*\*/g, "").replace(/\*/g, "-").trim();
  }

  /**
   * Analyzes file code using the LLM model and returns detailed feedback.
   *
   * @remarks
   * The analysis process includes:
   * 1. Creating a model instance with appropriate token limits
   * 2. Applying analysis templates based on feedback size
   * 3. Generating and formatting the analysis response
   *
   * @param code - The source code to analyze
   * @param size - The desired level of detail in the analysis
   * @param onProgress - Optional callback function to track analysis progress
   *
   * @returns A Promise that resolves to the formatted analysis result
   *
   * @throws {Error} If the AI model fails to process the code or generate a response
   */
  async analyzeFile(
    code: string,
    size: FeedbackSize,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    try {
      const model = this.createModel(TOKEN_LIMITS[size]);
      onProgress?.(25);

      const template = `
        ${REVIEW_TEMPLATES[size]}
        
        Code to analyze:
        ${code}
      `;

      onProgress?.(30);
      const result = await model.generateContent(template);
      onProgress?.(80);

      const response = result.response;
      return this.formatResponse(response.text());
    } catch {
      throw new Error("Unable to process response");
    }
  }

  /**
   * Analyzes a commit including its message, author, date, and changes using
   * the LLM model and returns detailed feedback.
   *
   * @remarks
   * The analysis includes:
   * 1. Commit metadata (message, author, date)
   * 2. Detailed analysis of file changes
   * 3. Analysis of the patch content
   *
   * @param commitInfo - Object containing commit details including message, author, date, and changes
   * @param size - The desired level of detail in the analysis
   * @param onProgress - Optional callback function to track analysis progress
   *
   * @returns A Promise that resolves to the formatted analysis result
   *
   * @throws {Error} If the AI model fails to process the commit or generate a response
   */
  async analyzeCommit(
    commitInfo: CommitInfo,
    size: FeedbackSize,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    try {
      const model = this.createModel(TOKEN_LIMITS[size]);
      onProgress?.(25);

      const changesText = commitInfo.changes
        .map(
          (change) => `
        File: ${change.filename}
        Changes: ${change.changes}
        Patch:
        ${change.patch}
      `,
        )
        .join("\n");

      const template = COMMIT_TEMPLATES[size]
        .replace("{message}", commitInfo.message)
        .replace("{author}", commitInfo.author)
        .replace("{date}", commitInfo.date)
        .replace("{changes}", changesText);

      onProgress?.(30);
      const result = await model.generateContent(template);
      onProgress?.(90);

      const response = result.response;
      return this.formatResponse(response.text());
    } catch {
      throw new Error("Unable to process response");
    }
  }
}
