import { FeedbackSize, AnalysisType } from "@/types";

export const FEEDBACK_OPTIONS = [
  { value: "concise", label: "Quick Review" },
  { value: "detailed", label: "Detailed Analysis" },
  { value: "comprehensive", label: "Deep Dive" },
];

export const DEFAULT_FEEDBACK_SIZE: FeedbackSize = "concise";
export const DEFAULT_ANALYSIS_TYPE: AnalysisType = "file";

export const REVIEW_TEMPLATES: Record<FeedbackSize, string> = {
  concise: `
    Brief code review - do not write this text in the form

    To calculate the quality score, use the the principle presented below:
    These metrics should be rated from 1 to 10, where 1 is the lowest and 10 is the highest score.
      Follow Descriptive Naming Conventions
      Use Comments Sparingly
      Keep Your Code DRY (Don't Repeat Yourself)
      Maintain a Consistent Coding Style
      Handle Errors and Exceptions Appropriately
      Optimize Code Performance
      Keep Your Code Modular
      Avoid the Use of Global Variables
      Document Your Code
    Then you sum up and getting the final score from 0 to 100. That will be the quality score.

    Then provide:
    Quality Score: [0-100] - mandatory field, should look like "Quality Score: 70"
    Give some reasons for this exact score
    Then provide:
    - Strengths, 3 key points shortly
    - Found issues, 3 main concerns shortly

    Try to be more specific and provide examples from the code

    Amount of text: from 200 to 500 characters at most
  `,
  detailed: `
    Detailed code review - do not write this text in the form

    To calculate the quality score, use the the principle presented below:
    These metrics should be rated from 1 to 10, where 1 is the lowest and 10 is the highest score.
      Follow Descriptive Naming Conventions
      Use Comments Sparingly
      Keep Your Code DRY (Don't Repeat Yourself)
      Maintain a Consistent Coding Style
      Handle Errors and Exceptions Appropriately
      Optimize Code Performance
      Keep Your Code Modular
      Avoid the Use of Global Variables
      Document Your Code
    Then you sum up and getting the final score from 0 to 100. That will be the quality score.

    Then provide:
    Quality Score: [0-100] - mandatory field, should look like "Quality Score: 70"
    Give some reasons for this exact score
    Then provide:
    Key Strengths: 4-5 key points
    Areas for Improvement: 4-5 main concerns
    Code Structure Analysis: possible points of improvement

    Try to be more specific and provide examples from the code

    Amount of text: from 1000 to 2000 characters at most
  `,
  comprehensive: `
    Comprehensive code review - do not write this text in the form

    To calculate the quality score, use the the principle presented below:
    These metrics should be rated from 1 to 10, where 1 is the lowest and 10 is the highest score.
      Follow Descriptive Naming Conventions
      Use Comments Sparingly
      Keep Your Code DRY (Don't Repeat Yourself)
      Maintain a Consistent Coding Style
      Handle Errors and Exceptions Appropriately
      Optimize Code Performance
      Keep Your Code Modular
      Avoid the Use of Global Variables
      Document Your Code
    Then you sum up and getting the final score from 0 to 100. That will be the quality score.

    Then provide:
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

    Try to be more specific and provide examples from the code

    Amount of text: from 5000 to 10000 characters at most
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

    Calculate quality score first using the formula:
    score = 100;
    if (additions + deletions > 500) score -= 20;
    else if (additions + deletions > 100) score -= 10;

    if (complexity > 15) score -= 15;
    if (hasTests) score += 10;

    return Math.max(0, Math.min(100, score));
 
    Then provide:
    Quality Score (0-100) - mandatory field based on calculations you've done, should look like "Quality Score: 70"
    Give some reasons for this exact score
    Then provide:
    - Key Changes Summary
    - Main Impact Points
    - Possible issues

    Try to be more specific and provide examples from commit

    Amount of text: from 200 to 500 characters at most
    `,

  detailed: `
    Detailed commit analysis:
    Commit: {message}
    Author: {author}
    Date: {date}
    
    Changes:
    {changes}

    Calculate quality score first using the formula:
    score = 100;
    if (additions + deletions > 500) score -= 20;
    else if (additions + deletions > 100) score -= 10;

    if (complexity > 15) score -= 15;
    if (hasTests) score += 10;

    return Math.max(0, Math.min(100, score));

    Then provide:
    Quality Score (0-100) - mandatory field, should look like "Quality Score: 70"
    Give some reasons for this exact score
    Then provide:
    - Summary of Changes
    - Impact Analysis
    - Best Practices Review
    - Suggestions

    Try to be more specific and provide examples from commit

    Amount of text: from 1000 to 2000 characters at most
    `,

  comprehensive: `
    In-depth commit analysis:
    Commit: {message}
    Author: {author}
    Date: {date}

    Changes:
    {changes}

    Calculate quality score first using the formula:
    score = 100;
    if (additions + deletions > 500) score -= 20;
    else if (additions + deletions > 100) score -= 10;

    if (complexity > 15) score -= 15;
    if (hasTests) score += 10;

    return Math.max(0, Math.min(100, score));

    Then provide comprehensive analysis:
    Quality Score (0-100) - mandatory field, should look like "Quality Score: 70"
    Give some reasons for this exact score
    Then provide:
    - Commit Overview
    - Technical Analysis
    - Best Practices
    - Impact Analysis
    - Security Review
    - Recommendations and suggestions

    Try to be more specific and provide examples from commit

    Amount of text: from 5000 to 10000 characters at most
    `,
};

export const TOKEN_LIMITS: Record<FeedbackSize, number> = {
  concise: 500,
  detailed: 2000,
  comprehensive: 10000,
};
