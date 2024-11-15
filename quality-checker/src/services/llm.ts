import { Anthropic } from '@anthropic-ai/sdk';
import { ChatAnthropic } from "@langchain/anthropic";
import { MessageContentText } from '@langchain/core/messages';
import { PromptTemplate } from "@langchain/core/prompts";
import { FeedbackSize } from '@/types';

export class CodeAnalysisService {
  private model: ChatAnthropic;

  constructor() {
    this.model = new ChatAnthropic({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      modelName: "claude-3-opus-20240229",
      maxTokens: 200,
    });
  }

  async analyzeCode(code: string, size: FeedbackSize): Promise<string> {
    const templates = {
      concise: `
        Brief code review (200 tokens):
        Score: [0-100]/100
        Strengths: 2-3 key points
        Issues: 2-3 main concerns
        Quick fixes: 1-2 suggestions
      `,
      detailed: `
        Detailed code review (500 tokens):
        Quality Score: [0-100]/100
        Key Strengths (3-4 points):
        Areas for Improvement (3-4 points):
        Code Structure Analysis:
        Security Considerations:
        Specific Recommendations:
      `,
      comprehensive: `
        Comprehensive code review (1000 tokens):
        Overall Quality Score: [0-100]/100
        
        Detailed Strengths Analysis:
        - Code Organization
        - Implementation Quality
        - Best Practices Usage
        - Documentation
        
        Areas Requiring Attention:
        - Code Quality Issues
        - Potential Bugs
        - Performance Concerns
        - Maintenance Challenges
        
        Security Assessment:
        - Vulnerability Analysis
        - Security Best Practices
        
        Recommendations:
        - High Priority Changes
        - Long-term Improvements
        - Refactoring Suggestions
        
        Additional Notes:
        - Edge Cases
        - Testing Considerations
        - Documentation Needs
      `
    };
  
    const template = `
      ${templates[size]}
      
      Code to analyze:
      {code}
    `;
  
    const maxTokens = {
      concise: 200,
      detailed: 500,
      comprehensive: 1000
    };

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