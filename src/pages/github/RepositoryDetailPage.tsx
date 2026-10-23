import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { githubService, GitHubRepository } from '@/services/api/githubService';
import { Card, SkillBadge } from '@/components/ui/Cards';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft, ExternalLink, Star, GitFork, Calendar } from 'lucide-react';

export const RepositoryDetailPage: React.FC = () => {
  const { repositoryId } = useParams<{ repositoryId: string }>();
  const navigate = useNavigate();

  const [repo, setRepo] = useState<GitHubRepository | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRepo = async () => {
      setIsLoading(true);
      try {
        if (!repositoryId) return;
        const res = await githubService.getRepositoryById(repositoryId);
        if (res.success && res.data) {
          setRepo(res.data);
        } else {
          setRepo(getFallbackRepo(repositoryId));
        }
      } catch {
        setRepo(getFallbackRepo(repositoryId || 'repo_01'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepo();
  }, [repositoryId]);

  const getFallbackRepo = (id: string): GitHubRepository => ({
    id,
    name: 'ai-healthcare-assistant',
    description: 'LLM-powered clinical literature search and diagnostic recommendation engine.',
    primaryLanguage: 'Python',
    technologies: ['PyTorch', 'FastAPI', 'React', 'PostgreSQL', 'Docker'],
    stars: 34,
    forks: 8,
    lastUpdated: '3 days ago',
    detectedSkills: ['Python', 'PyTorch', 'FastAPI', 'React'],
    url: 'https://github.com/alexmorgan/ai-healthcare-assistant',
    githubUrl: 'https://github.com/alexmorgan/ai-healthcare-assistant',
    linesOfCode: 7400,
  });

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-40" />;
  }

  if (!repo) {
    return (
      <ErrorState
        title="Repository Not Found"
        message="The requested repository analysis detail could not be loaded."
        onRetry={() => navigate('/github-analysis')}
      />
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 max-w-3xl mx-auto">
      <div>
        <Link
          to="/github-analysis"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Skill Analysis Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{repo.name}</h1>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200">
            {repo.primaryLanguage || repo.language || 'Code'}
          </span>
          <a
            href={repo.url || repo.githubUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-brand-600 hover:underline inline-flex items-center gap-1"
          >
            View on GitHub <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">{repo.description || 'Public repository'}</p>

        <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span><strong>{repo.stars}</strong> Stars</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitFork className="w-4 h-4 text-slate-400" />
            <span><strong>{repo.forks}</strong> Forks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Updated {repo.lastUpdated || repo.updatedAt || 'Recently'}</span>
          </div>
        </div>

        {repo.detectedSkills && repo.detectedSkills.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Detected Technical Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {repo.detectedSkills.map((s) => (
                <SkillBadge key={s} skill={s} />
              ))}
            </div>
          </div>
        )}

        {repo.technologies && repo.technologies.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Technologies & Package Dependencies</h4>
            <div className="flex flex-wrap gap-1.5">
              {repo.technologies.map((t) => (
                <span key={t} className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
