"use client";

import { useState } from "react";
import { AlertCircle, Github, Code2 } from "lucide-react";
import { AnimatedBackground } from "@/components/BackgroundAnimation";
import { FormInput } from "@/components/FormInput";
import { GitHubService } from "@/services/github";
import { FeedbackSize } from '@/types';

const CodeReviewApp = () => {
  const [repo, setRepo] = useState("");
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [feedbackSize, setFeedbackSize] = useState<FeedbackSize>("concise");

  const feedbackOptions = [
    { value: "concise", label: "Quick Review (200 tokens)" },
    { value: "detailed", label: "Detailed Analysis (500 tokens)" },
    { value: "comprehensive", label: "Deep Dive (1000 tokens)" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setShowAnalysis(false);

    try {
      const [owner, repoName] = repo.split("/");

      if (!owner || !repoName) {
        throw new Error("Invalid repository format. Use owner/repo format");
      }

      const githubService = new GitHubService();
      const analysis = await githubService.getFileContent(owner, repoName, sha, feedbackSize);

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
      <div className="w-full max-w-xl bg-gray-900/70 border border-gray-700 rounded-xl p-8 relative z-10 backdrop-blur-md">
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
            label="File SHA"
            value={sha}
            onChange={(e) => setSha(e.target.value)}
            placeholder="Enter file SHA"
            tooltip="To get the file SHA: Go to the terminal → curl https://api.github.com/repos/{user}/{repo}/contents/{file_name}"
            dropdown={{
              value: feedbackSize,
              onChange: (value) => setFeedbackSize(value as FeedbackSize),
              options: feedbackOptions
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

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {analysis && showAnalysis && (
          <div className="mt-6">
            <div className="border-t border-gray-700 pt-4">
              <h2 className="text-xl font-ethnocentric text-white mb-4">
                Analysis Results
              </h2>
              <div className="h-[300px] overflow-y-auto pr-4">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
                  {analysis}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
};

export default CodeReviewApp;
