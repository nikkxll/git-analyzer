import { FeedbackSize } from '@/types';

export const REVIEW_TEMPLATES: Record<FeedbackSize, string> = {
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

export const TOKEN_LIMITS: Record<FeedbackSize, number> = {
  concise: 200,
  detailed: 500,
  comprehensive: 1000
};