import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recommendationService, CandidateProfile } from '@/services/api/recommendationService';
import { ComplementarySkillComparison } from '@/components/recommendations/ComplementarySkillComparison';
import { MatchBreakdownModal } from '@/components/recommendations/MatchBreakdownModal';
import { Card, Avatar, Badge, SkillBadge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft, Sparkles, Github, Linkedin, UserPlus, CheckCircle2, Globe } from 'lucide-react';

export const CandidateProfilePage: React.FC = () => {
  const params = useParams<{ userId?: string; candidateId?: string; id?: string }>();
  const targetId = params.userId || params.candidateId || params.id;
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (!targetId) return;
        const res = await recommendationService.getCandidateById(targetId);
        if (res.success && res.data) {
          setCandidate(res.data);
        } else {
          setIsError(true);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidate();
  }, [targetId]);

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-48" />;
  }

  if (isError || !candidate) {
    return (
      <ErrorState
        title="Candidate Profile Not Found"
        message="Unable to load the requested candidate profile."
        onRetry={() => navigate('/recommendations')}
      />
    );
  }

  const skillsList = candidate.skills || candidate.matchedSkills || [];
  const explanationObj = candidate.explanation || {
    title: candidate.category ? candidate.category.replace('_', ' ') : 'AI Matchmaking Highlight',
    points: candidate.reason ? [candidate.reason] : ['Matched skills and project capability fit for team.'],
  };

  const matchBreakdownObj = candidate.matchBreakdown || {
    skillComplementarity: 90,
    problemFit: 88,
    technologyFit: 92,
    experienceRelevance: 85,
    overallCompatibility: candidate.compatibilityScore || 85,
  };

  return (
    <div className="space-y-6 text-left pb-16 max-w-4xl mx-auto">
      <div>
        <Link
          to="/recommendations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Teammate Recommendations
        </Link>
      </div>

      {/* Candidate Header */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-none shadow-modal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar name={candidate.name} src={candidate.avatarUrl || undefined} size="xl" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{candidate.name}</h1>
                <Badge variant="primary">{candidate.userType || candidate.role}</Badge>
              </div>
              <p className="text-xs font-semibold text-brand-300">{candidate.role}</p>
              <p className="text-xs text-slate-300">{candidate.college || candidate.company || 'TeamSync Member'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <button
              onClick={() => setIsBreakdownOpen(true)}
              className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-emerald-100 transition shadow-subtle"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              {candidate.compatibilityScore}% Compatibility Match
            </button>

            <Button size="md" leftIcon={<UserPlus className="w-4 h-4" />}>
              Invite to Team
            </Button>
          </div>
        </div>
      </Card>

      {/* Skill Complementarity Comparison */}
      <ComplementarySkillComparison
        userSkills={['React', 'TypeScript', 'Node.js', 'UI/UX']}
        candidateSkills={candidate.missingTeamSkillsCovered || candidate.missingSkillsFilled || []}
        candidateName={candidate.name}
      />

      {/* Skills & GitHub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technical Skills & Stack</h3>
          <div className="flex flex-wrap gap-1.5">
            {skillsList.map((s: any) => {
              const skillName = typeof s === 'string' ? s : s.name;
              return <SkillBadge key={skillName} skill={skillName} />;
            })}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">External Profiles</h3>
          <div className="space-y-2 text-xs">
            {candidate.githubUsername && (
              <a
                href={`https://github.com/${candidate.githubUsername}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition"
              >
                <span className="flex items-center gap-2 font-semibold text-slate-800">
                  <Github className="w-4 h-4 text-slate-900" /> @{candidate.githubUsername}
                </span>
                <Globe className="w-3.5 h-3.5 text-brand-600" />
              </a>
            )}

            {candidate.linkedInUrl && (
              <a
                href={candidate.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition"
              >
                <span className="flex items-center gap-2 font-semibold text-slate-800">
                  <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn Profile
                </span>
                <Globe className="w-3.5 h-3.5 text-brand-600" />
              </a>
            )}
          </div>
        </Card>
      </div>

      {/* GitHub Analytics */}
      {candidate.githubAnalytics && (
        <Card className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Github className="w-4 h-4" /> GitHub Analytics
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
              <span className="text-xl font-bold text-slate-800">{candidate.githubAnalytics.totalCommits || 0}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Commits</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
              <span className="text-xl font-bold text-slate-800">{candidate.githubAnalytics.totalStars || 0}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Stars</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
              <span className="text-xl font-bold text-slate-800">{candidate.githubAnalytics.totalForks || 0}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Forks</span>
            </div>
          </div>

          {candidate.githubAnalytics.topRepositories && candidate.githubAnalytics.topRepositories.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Projects</h4>
              {candidate.githubAnalytics.topRepositories.map((repo: any) => (
                <div key={repo.name} className="p-4 border border-slate-100 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <a href={repo.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand-600 hover:underline">
                      {repo.name}
                    </a>
                    {repo.language && (
                      <Badge variant="primary" className="text-[10px]">{repo.language}</Badge>
                    )}
                  </div>
                  {repo.description && <p className="text-xs text-slate-600 mb-3">{repo.description}</p>}
                  
                  {repo.recentCommits && repo.recentCommits.length > 0 && (
                    <div className="bg-slate-50 p-2 rounded-lg space-y-2 mt-2">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Recent Commits</p>
                      {repo.recentCommits.slice(0, 3).map((commit: any, idx: number) => (
                        <div key={idx} className="text-xs text-slate-600 truncate border-l-2 border-brand-200 pl-2">
                          <span className="font-semibold">{commit.author}:</span> {commit.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* AI Explanation Details */}
      <Card className="p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-brand-600" /> Why We Recommend {candidate.name}
        </h3>
        <p className="text-xs font-bold text-slate-800">{explanationObj.title}</p>
        <div className="space-y-1.5 text-xs text-slate-600">
          {explanationObj.points.map((pt, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Breakdown Modal */}
      {isBreakdownOpen && (
        <MatchBreakdownModal
          isOpen={isBreakdownOpen}
          onClose={() => setIsBreakdownOpen(false)}
          candidateName={candidate.name}
          breakdown={matchBreakdownObj}
        />
      )}
    </div>
  );
};
