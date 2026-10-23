import React from 'react';
import { GitHubRepository } from '@/services/api/githubService';
import { Card, SkillBadge } from '@/components/ui/Cards';
import { Star, GitFork, ExternalLink, Calendar, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface RepositoryCardProps {
  repository: GitHubRepository;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => {
  const navigate = useNavigate();

  return (
    <Card hoverable className="p-4 flex flex-col justify-between text-left">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-bold text-slate-900 truncate">{repository.name}</h4>
          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
            {repository.primaryLanguage || repository.language || 'Code'}
          </span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">{repository.description || 'Public repository'}</p>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {repository.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5 text-slate-400" /> {repository.forks}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> {repository.lastUpdated || 'Recently'}
          </span>
        </div>

        {repository.detectedSkills && repository.detectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {repository.detectedSkills.map((s) => (
              <SkillBadge key={s} skill={s} />
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => navigate(`/github-analysis/repository/${repository.id}`)}
          className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
        >
          <Code className="w-3.5 h-3.5" /> View Skill Breakdown
        </button>

        <a
          href={repository.url || repository.githubUrl || '#'}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
        >
          GitHub <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </Card>
  );
};
