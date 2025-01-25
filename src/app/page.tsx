"use client";

import { useState } from "react";
import { AlertCircle, Github, Code2, Copy, Check } from "lucide-react";
import { BackgroundAnimation } from "../components/BackgroundAnimation";
import { FormInput } from "../components/FormInput";
import { GitHubService } from "../services/gitDataAnalysis";
import Footer from "@/components/Footer";
import { FeedbackSize, AnalysisType } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  FEEDBACK_OPTIONS,
  DEFAULT_FEEDBACK_SIZE,
  DEFAULT_ANALYSIS_TYPE,
} from "../constants/feedback";

const CodeReviewApp = () => {
  const [repo, setRepo] = useLocalStorage("lastRepo", "");
  const [sha, setSha] = useLocalStorage("lastSha", "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [feedbackSize, setFeedbackSize] = useState<FeedbackSize>(
    DEFAULT_FEEDBACK_SIZE,
  );
  const [progress, setProgress] = useState(0);
  const [analysisType, setAnalysisType] = useState<AnalysisType>(
    DEFAULT_ANALYSIS_TYPE,
  );
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setProgress(0);

    try {
      const [owner, repoName] = repo.split("/");

      if (!owner || !repoName) {
        throw new Error("Invalid repository format. Use owner/repo format");
      }

      const githubService = new GitHubService();

      const analysis =
        analysisType === DEFAULT_ANALYSIS_TYPE
          ? await githubService.getFileAnalysis(
              owner,
              repoName,
              sha,
              feedbackSize,
              (progress: number) => setProgress(progress),
            )
          : await githubService.getCommitAnalysis(
              owner,
              repoName,
              sha,
              feedbackSize,
              (progress: number) => setProgress(progress),
            );

      setAnalysis(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (analysis) {
      try {
        await navigator.clipboard.writeText(analysis);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <BackgroundAnimation>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-6xl mx-auto mt-24 lg:mt-0 flex-grow px-4">
          <div className="w-full max-w-xl max-h-max bg-gray-900/70 border border-gray-700 rounded-xl p-[37px] relative z-10 backdrop-blur-md">
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="h-8 w-8 text-blue-400" />
                <h1 className="font-ethnocentric text-base lg:text-2xl bg-gradient-to-r from-blue-400 to-red-400 text-transparent bg-clip-text">
                  Code Quality Review
                </h1>
              </div>
              <p className="text-white text-lg font-electrolize">
                Enter a GitHub repository and file/commit SHA to analyze code
                quality
              </p>
            </div>

            <div className="mb-6 flex rounded-lg overflow-hidden">
              <button
                onClick={() => setAnalysisType("file")}
                className={`font-electrolize flex-1 py-5 px-1 lg:py-2 lg:px-4 ${
                  analysisType === "file"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                File Analysis
              </button>
              <button
                onClick={() => setAnalysisType("commit")}
                className={`font-electrolize flex-1 py-5 px-1 lg:py-2 lg:px-4 ${
                  analysisType === "commit"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                Commit Analysis
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <FormInput
                icon={<Github className="text-gray-400" />}
                label="Repository Path"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="owner/repository"
              />

              <FormInput
                icon={<AlertCircle className="text-gray-400" />}
                label={analysisType === "file" ? "File SHA" : "Commit SHA"}
                value={sha}
                onChange={(e) => setSha(e.target.value)}
                placeholder={
                  analysisType === "file"
                    ? "Enter file SHA"
                    : "Enter commit SHA"
                }
                tooltip={
                  analysisType === "file" ? "file-tooltip" : "commit-tooltip"
                }
                dropdown={{
                  value: feedbackSize,
                  onChange: (value) => setFeedbackSize(value as FeedbackSize),
                  options: FEEDBACK_OPTIONS,
                }}
              />

              <button
                type="submit"
                className="font-audiowide w-full bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 lg:py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze Code Quality"}
              </button>
            </form>

            {loading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Analyzing code...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}
          </div>

          <div
            className={`w-full max-w-xl bg-gray-900/70 border border-gray-700 rounded-xl p-8 mt-36 lg:mt-0 relative z-100 backdrop-blur-md ${
              !analysis ? "opacity-50" : ""
            }`}
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="h-8 w-8 text-blue-400" />
                <h1 className="font-ethnocentric text-xl lg:text-2xl bg-gradient-to-r from-blue-400 to-red-400 text-transparent bg-clip-text">
                  Analysis Results
                </h1>
              </div>
              <p className="text-white text-base font-electrolize">
                {analysis
                  ? "Code quality analysis report"
                  : "Waiting for code submission..."}
              </p>
            </div>

            <div className="h-[630px] lg:h-[400px] overflow-y-auto">
              {analysis ? (
                <>
                  <button
                    onClick={handleCopy}
                    className="absolute top-8 right-6 p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300 pr-2">
                    {analysis}
                  </pre>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No analysis results yet
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </BackgroundAnimation>
  );
};

export default CodeReviewApp;
