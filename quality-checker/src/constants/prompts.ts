import { FeedbackSize } from "@/types";

export const REVIEW_TEMPLATES: Record<FeedbackSize, string> = {
  concise: `
    Brief code review (300 tokens) - do not write this text in the form
    Score: [0-100]/100
    Strengths: 2-3 key points
    Issues: 2-3 main concerns
  `,
  detailed: `
    Detailed code review (500 tokens) - do not write this text in the form
    Quality Score: [0-100]/100
    Key Strengths (3-4 points):
    Areas for Improvement (3-4 points):
    Code Structure Analysis:
  `,
  comprehensive: `
    Comprehensive code review (1000 tokens) - do not write this text in the form
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
  `,
};

export const COMMIT_TEMPLATES: Record<FeedbackSize, string> = {
  concise: `
    Quick commit review:
    Commit: {message}
    Author: {author}
    Date: {date}
    
    Changes:
    {changes}
 
    Provide:
    1. Quality Score (0-100)
    2. Key Changes Summary
    3. Main Impact Points
    `,

  detailed: `
    Detailed commit analysis:
    Commit: {message}
    Author: {author}
    Date: {date}
    
    Changes:
    {changes}

    Provide:
    1. Commit Quality Score (0-100)
    2. Summary of Changes
    3. Impact Analysis
    4. Best Practices Review
    5. Suggestions
    `,

  comprehensive: `
    In-depth commit analysis:
    Commit: {message}
    Author: {author}
    Date: {date}

    Changes:
    {changes}

    Provide comprehensive analysis:
    1. Quality Score (0-100)
    2. Commit Overview
    3. Technical Analysis
    4. Best Practices
    5. Security Review
    6. Impact Analysis
    7. Recommendations
    `,
};

export const TOKEN_LIMITS: Record<FeedbackSize, number> = {
  concise: 300,
  detailed: 500,
  comprehensive: 1000,
};
