import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamRequest } from '@/services/api/teamService';
import { Card, Avatar, SkillBadge, Badge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Check, X, Sparkles, GraduationCap, Github, Linkedin, ExternalLink } from 'lucide-react';

export interface TeamRequestCardProps {
  request: TeamRequest;
  onAccept: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export const TeamRequestCard: React.FC<TeamRequestCardProps> = ({ request, onAccept, onReject }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusState, setStatusState] = useState(request.status);

  const handleAcceptClick = async () => {
    setIsProcessing(true);
    try {
      await onAccept(request.id);
      setStatusState('ACCEPTED');
    } catch {
      // Handled
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = async () => {
    setIsProcessing(true);
    try {
      await onReject(request.id);
      setStatusState('REJECTED');
    } catch {
      // Handled
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-5 text-left flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={request.applicantName || 'Applicant'} src={request.applicantAvatarUrl} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{request.applicantName || 'Applicant'}</h4>
                {request.matchScore !== undefined && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> {request.matchScore}% Match
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-brand-600" /> {request.applicantCollege || 'Institution'} • {request.applicantDepartment || 'Department'}
              </p>

              {/* Linked Accounts (GitHub & LinkedIn) */}
              <div className="flex items-center gap-3 mt-1.5">
                {request.applicantGithubUrl && (
                  <a
                    href={request.applicantGithubUrl.startsWith('http') ? request.applicantGithubUrl : `https://${request.applicantGithubUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition"
                  >
                    <Github className="w-3.5 h-3.5 text-slate-800" /> GitHub
                  </a>
                )}
                {request.applicantLinkedinUrl && (
                  <a
                    href={request.applicantLinkedinUrl.startsWith('http') ? request.applicantLinkedinUrl : `https://${request.applicantLinkedinUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded-md transition"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-sky-600" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">{request.requestedAt || request.createdAt || 'Recently'}</span>
        </div>

        {/* Message */}
        {request.message && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 text-xs text-slate-700 leading-relaxed italic">
            "{request.message}"
          </div>
        )}

        {/* Highlighted Skills */}
        {request.applicantSkills && request.applicantSkills.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1.5">Applicant Skills:</span>
            <div className="flex flex-wrap gap-1.5">
              {request.applicantSkills.map((s) => (
                <SkillBadge key={s} skill={s} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile View & Decision CTAs */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {request.applicantId && (
          <SecondaryButton
            size="sm"
            fullWidth
            onClick={() => navigate(`/candidates/${request.applicantId}`)}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            className="text-xs font-semibold py-1.5"
          >
            View Candidate Profile
          </SecondaryButton>
        )}

        {statusState === 'PENDING' ? (
          <div className="flex items-center gap-2 w-full">
            <Button
              size="sm"
              fullWidth
              isLoading={isProcessing}
              onClick={handleAcceptClick}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Accept Applicant
            </Button>
            <SecondaryButton
              size="sm"
              fullWidth
              disabled={isProcessing}
              onClick={handleRejectClick}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
              leftIcon={<X className="w-3.5 h-3.5" />}
            >
              Reject
            </SecondaryButton>
          </div>
        ) : (
          <div className="w-full text-right pt-1">
            <Badge variant={statusState === 'ACCEPTED' ? 'success' : 'danger'}>
              {statusState === 'ACCEPTED' ? 'Accepted ✓' : 'Rejected'}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};
