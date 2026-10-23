import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService, ProblemStatement } from '@/services/api/eventService';
import { Card, Badge, SkillBadge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft, Code2, Users, CheckCircle2, Sparkles, Plus } from 'lucide-react';

export const ProblemStatementDetailPage: React.FC = () => {
  const { eventId, problemId } = useParams<{ eventId: string; problemId: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchProblem = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (!eventId || !problemId) return;
        const response = await eventService.getProblemStatementById(eventId, problemId);
        if (response.success && response.data) {
          setProblem(response.data);
        } else {
          setProblem(null);
        }
      } catch {
        setProblem(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblem();
  }, [eventId, problemId]);



  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-48" />;
  }

  if (isError || !problem) {
    return (
      <ErrorState
        title="Problem Statement Not Found"
        message="Unable to load the requested problem statement details."
        onRetry={() => navigate(`/events/${eventId}`)}
      />
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 max-w-4xl mx-auto">
      {/* Navigation Back Link */}
      <div>
        <Link
          to={`/events/${eventId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Event Details
        </Link>
      </div>

      {/* Problem Header */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-none shadow-modal">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="primary">{problem.domain}</Badge>
            <Badge variant="warning">{problem.difficulty} Difficulty</Badge>
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              <Users className="w-3.5 h-3.5 text-indigo-300" /> Team Size: {problem.teamSizeMin}–{problem.teamSizeMax} Members
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">{problem.title}</h1>
          <p className="text-xs text-slate-300 leading-relaxed">{problem.shortDescription}</p>

          <div className="flex flex-wrap gap-3 pt-3">
            <Button
              onClick={() => navigate(`/events/${eventId}/find-team`)}
              size="md"
              leftIcon={<Users className="w-4 h-4" />}
            >
              Find Team for Problem
            </Button>
            <SecondaryButton
              onClick={() => navigate(`/events/${eventId}/create-team`)}
              size="md"
              className="bg-white/10 text-white hover:bg-white/20 border-white/30"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Team for Problem
            </SecondaryButton>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Full Description & Deliverables */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Problem Description & Requirements</h3>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {problem.fullDescription}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Expected Deliverables</h3>
            <div className="space-y-2 text-xs text-slate-700">
              {problem.expectedDeliverables.map((deliv, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{deliv}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Required Skills & Tech Stack */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Required Skills</h3>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {problem.requiredSkills.map((s) => (
                <SkillBadge key={s} skill={s} />
              ))}
            </div>

            {problem.preferredTechnologies && problem.preferredTechnologies.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1.5">Preferred Stack:</span>
                <div className="flex flex-wrap gap-1.5">
                  {problem.preferredTechnologies.map((t) => (
                    <span key={t} className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card className="bg-brand-50/50 border-brand-100 text-left">
            <div className="flex items-center gap-2 text-brand-700 mb-2">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold">AI Team Matching Available</h4>
            </div>
            <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
              Our algorithm can pair you with developers possessing complementary skills required for this problem.
            </p>
            <button
              onClick={() => navigate(`/events/${eventId}/find-team`)}
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              Match with Teammates →
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};
