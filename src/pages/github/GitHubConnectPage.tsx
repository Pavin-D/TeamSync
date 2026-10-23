import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { githubService, GitHubProfile } from '@/services/api/githubService';
import { GitHubProfileCard } from '@/components/github/GitHubProfileCard';
import { GitHubAnalysisProgress } from '@/components/github/GitHubAnalysisProgress';
import { TextInput } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Github, Sparkles, ArrowRight } from 'lucide-react';

export const GitHubConnectPage: React.FC = () => {
  const navigate = useNavigate();

  const [githubUrl, setGithubUrl] = useState('');
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await githubService.getGitHubProfile();
        if (res.success && res.data) {
          setProfile(res.data);
          if (res.data.profileUrl) setGithubUrl(res.data.profileUrl);
          else if (res.data.username) setGithubUrl(`https://github.com/${res.data.username}`);
        }
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsAnalyzing(true);
    setAnalysisProgress(15);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 15;
      });
    }, 400);

    try {
      if (githubUrl) {
        await githubService.connectGitHub(githubUrl);
      }
      const response = await githubService.startGitHubAnalysis();
      clearInterval(interval);
      setAnalysisProgress(100);

      if (response.success && response.data) {
        setProfile({
          username: response.data.username,
          name: response.data.profile?.name || response.data.username,
          avatarUrl: response.data.profile?.avatarUrl,
          bio: response.data.profile?.bio,
          publicReposCount: response.data.analyzedRepositories,
          profileUrl: `https://github.com/${response.data.username}`,
          analysisState: 'COMPLETED',
          lastAnalyzedAt: 'Just now',
        });
      }
    } catch (err: any) {
      clearInterval(interval);
      setErrorMessage(err.message || 'GitHub analysis failed. Please verify your profile URL and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-40" />;
  }

  return (
    <div className="space-y-6 text-left pb-16 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Github className="w-6 h-6 text-slate-900" />
          <h1 className="text-2xl font-bold text-slate-900">GitHub Profile Integration</h1>
        </div>
        <p className="text-xs text-slate-500">
          Connect your GitHub account so our AI engine can detect your technical proficiency and suggest complementary teammates.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
          {errorMessage}
        </div>
      )}

      {profile && <GitHubProfileCard profile={profile} onReanalyze={() => setIsAnalyzing(true)} />}

      {/* Analysis Form & Progress */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Analyze GitHub Activity</h3>

        <form onSubmit={handleStartAnalysis} className="space-y-4">
          <TextInput
            label="GitHub Profile URL *"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username"
            required
            helperText="Public repository data only. Private repositories and auth tokens are never accessed."
          />

          {isAnalyzing ? (
            <GitHubAnalysisProgress percentage={analysisProgress} />
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Button type="submit" leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}>
                Analyze GitHub Profile
              </Button>

              {profile?.analysisState === 'COMPLETED' && (
                <SecondaryButton
                  type="button"
                  onClick={() => navigate('/profile/skill-analysis')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View Full Skill Dashboard
                </SecondaryButton>
              )}
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};
