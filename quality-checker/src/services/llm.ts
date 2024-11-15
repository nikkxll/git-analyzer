import { GoogleGenerativeAI } from "@google/generative-ai";
import { FeedbackSize, CommitInfo } from "@/types";
import {
  REVIEW_TEMPLATES,
  COMMIT_TEMPLATES,
  TOKEN_LIMITS,
} from "@/constants/prompts";

export class CodeAnalysisService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  private formatResponse(text: string): string {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '-')
      .trim();
  }

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
  }

  private createModel(tokenLimit: number) {
    return this.genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        maxOutputTokens: tokenLimit,
      },
    });
  }

  async analyzeCode(
    code: string,
    size: FeedbackSize,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      this.model = this.createModel(TOKEN_LIMITS[size]);
      onProgress?.(25);

      const template = `
        ${REVIEW_TEMPLATES[size]}
        
        Code to analyze:
        ${code}
      `;

      onProgress?.(30);
      const result = await this.model.generateContent(template);
      onProgress?.(80);

      const response = await result.response;
      return this.formatResponse(response.text());
    } catch (error) {
      throw new Error("Unable to process response");
    }
  }

  async analyzeCommit(
    commitInfo: CommitInfo,
    size: FeedbackSize,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const changesText = commitInfo.changes
        .map(
          (change) => `
        File: ${change.filename}
        Changes: ${change.changes}
        Patch:
        ${change.patch}
      `
        )
        .join("\n");

      const template = COMMIT_TEMPLATES[size]
        .replace("{message}", commitInfo.message)
        .replace("{author}", commitInfo.author)
        .replace("{date}", commitInfo.date)
        .replace("{changes}", changesText);

      onProgress?.(80);
      const result = await this.model.generateContent(template);
      onProgress?.(90);

      const response = await result.response;
      return this.formatResponse(response.text());
    } catch (error) {
      throw new Error("Unable to process response");
    }
  }
}
