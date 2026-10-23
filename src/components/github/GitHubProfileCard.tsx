import React from 'react';
import { GitHubProfile } from '@/services/api/githubService';
import { Card, Avatar, Badge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { Github, RefreshCw, ExternalLink } from 'lucide-react';

export interface GitHubProfileCardProps {
  profile: GitHubProfile;
  onReanalyze?: () => void;
}

export const GitHubProfileCard: React.FC<GitHubProfileCardProps> = ({
  profile,
  onReanalyze,
}) => {
  const getStatusBadge = (status: GitHubProfile['analysisState']) => {
    switch (status) {
      case 'CONNECTED':
      case 'COMPLETED':
        return <Badge variant="success">Analysis Synced ✓</Badge>;
      case 'ANALYZING':
        return <Badge variant="warning">Analyzing Repositories...</Badge>;
      case 'OUTDATED':
        return <Badge variant="warning">Analysis Outdated</Badge>;
      case 'FAILED':
        return <Badge variant="danger">Analysis Failed</Badge>;
      default:
        return <Badge variant="default">Not Connected</Badge>;
    }
  };

  return (
    <Card className="p-6 text-left space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-4">
          <Avatar name={profile.name || profile.username} src={profile.avatarUrl} size="xl" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
              {getStatusBadge(profile.analysisState)}
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Github className="w-3.5 h-3.5 text-slate-700" /> @{profile.username}
            </p>
            {profile.bio && <p className="text-xs text-slate-600 mt-1 max-w-lg">{profile.bio}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {onReanalyze && (
            <Button size="sm" onClick={onReanalyze} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              Re-analyze GitHub
            </Button>
          )}
          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition inline-flex items-center gap-1 text-xs font-semibold"
          >
            <span>GitHub Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block mb-0.5">Public Repositories</span>
          <span className="font-extrabold text-slate-900 text-sm">{profile.publicReposCount}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block mb-0.5">Followers</span>
          <span className="font-extrabold text-slate-900 text-sm">{profile.followersCount}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block mb-0.5">Contributions This Year</span>
          <span className="font-extrabold text-brand-600 text-sm">{profile.totalContributionsThisYear}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block mb-0.5">Last Analyzed</span>
          <span className="font-semibold text-slate-800">{profile.lastAnalyzedAt || 'Just now'}</span>
        </div>
      </div>
    </Card>
  );
};
