import { ChatAnthropic } from "@langchain/anthropic";
import { MessageContentText } from '@langchain/core/messages';
import { PromptTemplate } from "@langchain/core/prompts";
import { FeedbackSize } from '@/types';
import { REVIEW_TEMPLATES, TOKEN_LIMITS } from '@/constants/prompts';

export class CodeAnalysisService {
  private model: ChatAnthropic;

  constructor() {
    this.model = new ChatAnthropic({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      modelName: "claude-3-opus-20240229",
      maxTokens: 200,
    });
  }
  
  private createModel(tokenLimit: number): ChatAnthropic {
    return new ChatAnthropic({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      modelName: "claude-3-opus-20240229",
      maxTokens: tokenLimit,
    });
  }

  async analyzeCode(code: string, size: FeedbackSize): Promise<string> {
    this.model = this.createModel(TOKEN_LIMITS[size]);

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
    const response = await this.model.invoke(formattedPrompt);
    
    if (typeof response.content === 'string') {
      return response.content;
    } else if (Array.isArray(response.content)) {
      return response.content
        .filter((item): item is MessageContentText => 'type' in item && item.type === 'text')
        .map(item => item.text)
        .join('');
    }
    
    return 'Unable to process response';
  }
}