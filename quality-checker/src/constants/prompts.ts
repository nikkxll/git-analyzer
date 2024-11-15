import { FeedbackSize } from "@/types";

export const REVIEW_TEMPLATES: Record<FeedbackSize, string> = {
  concise: `
    Brief code review - do not write this text in the form
    Quality Score: [0-100] - mandatory field, should look like "Quality Score: 70"
    Strengths: 2-3 key points
    Issues: 2-3 main concerns
  `,
  detailed: `
    Detailed code review - do not write this text in the form
    Quality Score: [0-100] - mandatory field, should look like "Quality Score: 70"
    Key Strengths (3-4 points):
    Areas for Improvement (3-4 points):
    Code Structure Analysis:
  `,
  comprehensive: `
    Comprehensive code review - do not write this text in the form
    Quality Score: [0-100] - mandatory field, should look like "Quality Score: 70"
    
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
    Quality Score (0-100) - mandatory field, should look like "Quality Score: 70"
    1. Key Changes Summary
    2. Main Impact Points
    `,

  detailed: `
    Detailed commit analysis:
    Commit: {message}
    Author: {author}
    Date: {date}
    
    Changes:
    {changes}

    Provide:
    Quality Score (0-100) - mandatory field, should look like "Quality Score: 70"
    1. Summary of Changes
    2. Impact Analysis
    3. Best Practices Review
    4. Suggestions
    `,

  comprehensive: `
    In-depth commit analysis:
    Commit: {message}
    Author: {author}
    Date: {date}

    Changes:
    {changes}

    Provide comprehensive analysis:
    Quality Score (0-100) - mandatory field, should look like "Quality Score: 70"
    1. Commit Overview
    2. Technical Analysis
    3. Best Practices
    4. Security Review
    5. Impact Analysis
    6. Recommendations
    `,
};

export const TOKEN_LIMITS: Record<FeedbackSize, number> = {
  concise: 500,
  detailed: 2000,
  comprehensive: 5000,
};
