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

export type ScoreMeterProps = {
  score: number;
};