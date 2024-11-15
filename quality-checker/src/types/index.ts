export type FeedbackSize = "concise" | "detailed" | "comprehensive";
export type AnalysisType = "file" | "commit";

export interface CommitInfo {
  message: string;
  author: string;
  date: string;
  changes: Change[];
}

export interface Change {
  filename: string;
  changes: string;
  patch: string;
}

export interface GitHubFile {
  filename: string;
  additions: number;
  deletions: number;
  patch: string;
}