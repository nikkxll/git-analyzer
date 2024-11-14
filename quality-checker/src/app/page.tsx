"use client"

import { useState } from 'react';
import { AlertCircle, Github, Code2 } from 'lucide-react';
import { AnimatedBackground } from '@/components/BackgroundAnimation';
import { FormInput } from '@/components/FormInput';

const CodeReviewApp = () => {
  const [repo, setRepo] = useState('');
  const [sha, setSha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1000);

    setLoading(false);
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
          />

          <button 
            type="submit" 
            className="font-audiowide w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Code Quality'}
          </button>
        </form>
      </div>
    </AnimatedBackground>
  );
};

export default CodeReviewApp;