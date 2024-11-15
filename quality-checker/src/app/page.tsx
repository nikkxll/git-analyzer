"use client";

import { useState } from "react";
import { AlertCircle, Github, Code2 } from "lucide-react";
import { AnimatedBackground } from "@/components/BackgroundAnimation";
import { FormInput } from "@/components/FormInput";
import { GitHubService } from "@/services/github";
import { FeedbackSize, AnalysisType } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const CodeReviewApp = () => {
  const [repo, setRepo] = useLocalStorage('lastRepo', '');
  const [sha, setSha] = useLocalStorage('lastSha', '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [feedbackSize, setFeedbackSize] = useState<FeedbackSize>("concise");
  const [progress, setProgress] = useState(0);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('file');

  const feedbackOptions = [
    { value: "concise", label: "Quick Review" },
    { value: "detailed", label: "Detailed Analysis" },
    { value: "comprehensive", label: "Deep Dive" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setShowAnalysis(false);
    setProgress(0);

    try {
      const [owner, repoName] = repo.split("/");

      if (!owner || !repoName) {
        throw new Error("Invalid repository format. Use owner/repo format");
      }

      const githubService = new GitHubService();

      const analysis = analysisType === 'file'
      ? await githubService.getFileContent(
          owner,
          repoName,
          sha,
          feedbackSize,
          (progress: number) => setProgress(progress)
        )
        : await githubService.getCommitDetails(
          owner,
          repoName,
          sha,
          feedbackSize,
          (progress: number) => setProgress(progress)
        );

      setAnalysis(analysis);
      setTimeout(() => setShowAnalysis(true), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <div className="flex items-center gap-8 w-full max-w-6xl mx-auto">
        <div className="w-full max-w-xl max-h-max bg-gray-900/70 border border-gray-700 rounded-xl p-8 relative z-10 backdrop-blur-md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="h-8 w-8 text-blue-400" />
              <h1 className="font-ethnocentric text-2xl bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Code Quality Review
              </h1>
            </div>
            <p className="text-white text-base font-electrolize">
              Enter a GitHub repository and file SHA to analyze code quality
            </p>
          </div>

          <div className="mb-6 flex rounded-lg overflow-hidden">
            <button
              onClick={() => setAnalysisType('file')}
              className={`flex-1 py-2 px-4 ${
                analysisType === 'file'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              File Analysis
            </button>
            <button
              onClick={() => setAnalysisType('commit')}
              className={`flex-1 py-2 px-4 ${
                analysisType === 'commit'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              Commit Analysis
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              icon={<Github className="text-gray-400" />}
              label="Repository Path"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="owner/repository"
            />

            <FormInput
              icon={<AlertCircle className="text-gray-400" />}
              label="File/commit SHA"
              value={sha}
              onChange={(e) => setSha(e.target.value)}
              placeholder="Enter file/commit SHA"
              tooltip="To get the file SHA: Go to the terminal → curl https://api.github.com/repos/{user}/{repo}/contents/{file_name}"
              dropdown={{
                value: feedbackSize,
                onChange: (value) => setFeedbackSize(value as FeedbackSize),
                options: feedbackOptions,
              }}
            />

            <button
              type="submit"
              className="font-audiowide w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
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
          className={`w-full max-w-xl bg-gray-900/70 border border-gray-700 rounded-xl p-8 relative z-100 backdrop-blur-md ${
            !analysis ? "opacity-50" : ""
          }`}
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="h-8 w-8 text-blue-400" />
              <h1 className="font-ethnocentric text-2xl bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Analysis Results
              </h1>
            </div>
            <p className="text-white text-base font-electrolize">
              {analysis
                ? "Code quality analysis report"
                : "Waiting for code submission..."}
            </p>
          </div>

          <div className="h-[400px] overflow-y-auto">
            {analysis ? (
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
                {analysis}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No analysis results yet
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default CodeReviewApp;
