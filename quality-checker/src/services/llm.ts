import { ChatAnthropic } from "@langchain/anthropic";
import { MessageContentText } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { FeedbackSize, CommitInfo, Change } from "@/types";
import {
  REVIEW_TEMPLATES,
  COMMIT_TEMPLATES,
  TOKEN_LIMITS,
} from "@/constants/prompts";

export class CodeAnalysisService {
  private model: ChatAnthropic;

  constructor() {
    this.model = new ChatAnthropic({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      modelName: "claude-3-opus-20240229",
      maxTokens: 300,
    });
  }

  private createModel(tokenLimit: number): ChatAnthropic {
    return new ChatAnthropic({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      modelName: "claude-3-opus-20240229",
      maxTokens: tokenLimit,
    });
  }

  async analyzeCode(
    code: string,
    size: FeedbackSize,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    this.model = this.createModel(TOKEN_LIMITS[size]);

    onProgress?.(25);
    const template = `
      ${REVIEW_TEMPLATES[size]}
      
      Code to analyze:
      {code}
    `;

    const prompt = new PromptTemplate({
      template,
      inputVariables: ["code"],
    });

    const formattedPrompt = await prompt.format({ code });
    onProgress?.(30);
    const response = await this.model.invoke(formattedPrompt);
    onProgress?.(80);

    if (typeof response.content === "string") {
      return response.content;
    } else if (Array.isArray(response.content)) {
      return response.content
        .filter(
          (item): item is MessageContentText =>
            "type" in item && item.type === "text"
        )
        .map((item) => item.text)
        .join("");
    }

    return "Unable to process response";
  }

  async analyzeCommit(
    commitInfo: CommitInfo,
    size: FeedbackSize,
    onProgress?: (progress: number) => void
  ): Promise<string> {
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

    const template = COMMIT_TEMPLATES[size];

    const formattedTemplate = template
      .replace("{message}", commitInfo.message)
      .replace("{author}", commitInfo.author)
      .replace("{date}", commitInfo.date)
      .replace("{changes}", changesText);

    onProgress?.(80);
    const response = await this.model.invoke(formattedTemplate);
    onProgress?.(90);

    if (typeof response.content === "string") {
      return response.content;
    } else if (Array.isArray(response.content)) {
      return response.content
        .filter(
          (item): item is MessageContentText =>
            "type" in item && item.type === "text"
        )
        .map((item) => item.text)
        .join("");
    }

    return "Unable to process response";
  }
}
