import { FeedbackSize } from "@/types";

export const REVIEW_TEMPLATES: Record<FeedbackSize, string> = {
  concise: `
    Brief code review - do not write this text in the form
    Quality Score: [0-100] - mandatory field, should look like "Quality Score: 70"
    Give some reasons for this exact score
    Then provide:
    - Strengths, 3 key points shortly
    - Found issues, 3 main concerns shortly
    
  `,
  detailed: `
    Detailed code review - do not write this text in the form
    Quality Score: [0-100] - mandatory field, should look like "Quality Score: 70"
    Give some reasons for this exact score
    Then provide:
    Key Strengths: 4-5 key points
    Areas for Improvement: 4-5 main concerns
    Code Structure Analysis: possible points of improvement
  `,
  comprehensive: `
    Comprehensive code review - do not write this text in the form
    Quality Score: [0-100] - mandatory field, should look like "Quality Score: 70"
    
    Give some reasons for this exact score
    Then provide:
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
    
    Recommendations and Suggestions:
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
    Give some reasons for this exact score
    Then provide:
    - Key Changes Summary
    - Main Impact Points
    - Possible issues
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
    Give some reasons for this exact score
    Then provide:
    - Summary of Changes
    - Impact Analysis
    - Best Practices Review
    - Suggestions
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
    Give some reasons for this exact score
    Then provide:
    - Commit Overview
    - Technical Analysis
    - Best Practices
    - Impact Analysis
    - Security Review
    - Recommendations and suggestions
    `,
};

export const TOKEN_LIMITS: Record<FeedbackSize, number> = {
  concise: 500,
  detailed: 2000,
  comprehensive: 5000,
};
