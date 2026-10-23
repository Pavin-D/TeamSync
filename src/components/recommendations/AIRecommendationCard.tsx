import React, { useState } from 'react';
import { CandidateProfile } from '@/services/api/recommendationService';
import { Card, Avatar, SkillBadge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { MatchBreakdownModal } from './MatchBreakdownModal';
import { Sparkles, ChevronDown, ChevronUp, UserPlus, CheckCircle2, Heart, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface AIRecommendationCardProps {
  candidate: CandidateProfile;
  onInvite?: (candidateId: string) => void;
  onRequestMentorship?: (candidateId: string) => void;
  onSaveToggle?: (candidateId: string, isSaved: boolean) => void;
  onDismiss?: (candidateId: string) => void;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  candidate,
  onInvite,
  onRequestMentorship,
  onSaveToggle,
  onDismiss,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isSavedState, setIsSavedState] = useState(candidate.isSaved || false);

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

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isSavedState;
    setIsSavedState(next);
    if (onSaveToggle) onSaveToggle(candidate.id, next);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDismiss) onDismiss(candidate.id);
  };

  return (
    <Card hoverable className="p-5 flex flex-col justify-between text-left relative">
      <div>
        {/* Header with Compatibility Badge & Save/Dismiss buttons */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={candidate.name} src={candidate.avatarUrl || undefined} size="lg" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">{candidate.name}</h4>
              <p className="text-xs font-semibold text-brand-600">{candidate.role}</p>
              <p className="text-[11px] text-slate-500">{candidate.college || candidate.company || 'TeamSync Member'}</p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => setIsBreakdownOpen(true)}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-emerald-100 transition shadow-subtle"
              title="Click to view full match score breakdown"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {candidate.compatibilityScore}% Match
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleSave}
                className={`p-1 rounded-lg border transition ${
                  isSavedState ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500'
                }`}
                title={isSavedState ? 'Remove from saved' : 'Save candidate'}
              >
                <Heart className={`w-3.5 h-3.5 ${isSavedState ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
                title="Dismiss recommendation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Skills Tag Cloud */}
        {skillsList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {skillsList.map((s) => (
              <SkillBadge key={s} skill={s} />
            ))}
          </div>
        )}

        {/* Complementary Skill Coverage Highlight */}
        {candidate.missingTeamSkillsCovered && candidate.missingTeamSkillsCovered.length > 0 && (
          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl mb-3 text-xs">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-0.5">Skill Gap Covered:</span>
            <span className="font-semibold text-emerald-900">{candidate.missingTeamSkillsCovered.join(', ')}</span>
          </div>
        )}

        {/* Expandable Why This Person AI Explanation Panel */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200 transition"
          >
            <span className="flex items-center gap-1.5 text-brand-700">
              <Sparkles className="w-3.5 h-3.5" /> Why recommended for your team?
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-2 p-3 bg-brand-50/40 border border-brand-100 rounded-xl space-y-1.5 text-xs text-slate-700 animate-in fade-in">
              <h5 className="font-bold text-slate-900 mb-1">{explanationObj.title}</h5>
              {explanationObj.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action CTAs: Includes Request Mentor for Professionals & Mentors */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap sm:flex-nowrap">
        <Button
          size="sm"
          className="flex-1 text-xs"
          onClick={() => {
            const targetId = candidate.userId || candidate.candidateId || candidate.id;
            if (onInvite) onInvite(targetId);
          }}
          leftIcon={<UserPlus className="w-3.5 h-3.5" />}
        >
          Invite to Team
        </Button>

        {(candidate.role === 'PROFESSIONAL' || candidate.userType === 'PROFESSIONAL' || candidate.category === 'PROFESSIONAL_EXPERT' || candidate.category === 'MENTOR_MATCH' || candidate.company || candidate.jobTitle) && (
          <Button
            size="sm"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0"
            onClick={() => {
              const targetId = candidate.userId || candidate.candidateId || candidate.id;
              if (onRequestMentorship) {
                onRequestMentorship(targetId);
              } else if (onInvite) {
                onInvite(targetId);
              }
            }}
            leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
          >
            Request Mentor
          </Button>
        )}

        <SecondaryButton
          size="sm"
          onClick={() => {
            const targetId = candidate.userId || candidate.candidateId || candidate.id;
            navigate(`/recommendations/${targetId}`);
          }}
          rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          className="text-xs shrink-0"
        >
          Profile
        </SecondaryButton>
      </div>

      {/* Match Breakdown Modal */}
      {isBreakdownOpen && (
        <MatchBreakdownModal
          isOpen={isBreakdownOpen}
          onClose={() => setIsBreakdownOpen(false)}
          candidateName={candidate.name}
          breakdown={matchBreakdownObj}
        />
      )}
    </Card>
  );
};
