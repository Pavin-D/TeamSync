import React from 'react';
import { MentorProfile } from '@/services/api/mentorService';
import { Card, Avatar, SkillBadge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Star, Users, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface MentorCardProps {
  mentor: MentorProfile;
  onRequestMentorship?: (mentorId: string) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onRequestMentorship }) => {
  const navigate = useNavigate();
  const currentCount = mentor.currentActiveMenteesCount ?? 0;
  const maxMentees = mentor.maxActiveMentees ?? 3;
  const isFull = currentCount >= maxMentees;
  const rating = mentor.averageRating ?? 4.9;
  const skills = mentor.primarySkills || mentor.skills || [];
  const areas = mentor.mentoringAreas || ['Technical Development', 'Architecture'];

  return (
    <Card hoverable className="p-5 flex flex-col justify-between text-left relative">
      <div>
        {/* Header with Avatar & Ratings */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={mentor.name} src={mentor.avatarUrl} size="lg" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">{mentor.name}</h4>
              <p className="text-xs font-semibold text-brand-600">{mentor.title || mentor.jobTitle || 'Tech Leader'}</p>
              <p className="text-[11px] text-slate-500">{mentor.company} • {mentor.yearsOfExperience || 5} yrs exp</p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 gap-1">
            {mentor.matchScore && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {mentor.matchScore}% Match
              </span>
            )}
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {rating.toFixed(1)} ({mentor.totalReviewsCount || 10})
            </span>
          </div>
        </div>

        {/* Capacity & Distance Sub-bar */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-3">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {isFull ? (
              <strong className="text-rose-600">Capacity Full ({currentCount}/{maxMentees})</strong>
            ) : (
              <span>Active Mentees: <strong>{currentCount} / {maxMentees}</strong></span>
            )}
          </span>

          {mentor.distanceKm ? (
            <span className="flex items-center gap-1 text-sky-700 font-semibold">
              <MapPin className="w-3.5 h-3.5" /> Approx. {mentor.distanceKm} km
            </span>
          ) : (
            <span className="text-slate-400 font-medium">Remote Available</span>
          )}
        </div>

        {/* Primary Skills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {skills.map((s) => (
            <SkillBadge key={s} skill={s} />
          ))}
        </div>

        {/* Mentoring Areas Badges */}
        <div className="text-[11px] text-slate-500 mb-4">
          <span className="font-semibold text-slate-700 block mb-1">Mentors in:</span>
          <div className="flex flex-wrap gap-1">
            {areas.slice(0, 3).map((area) => (
              <span key={area} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold border border-indigo-100">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action CTAs */}
      {/* Dual Role CTAs: Invite as Team Member OR Request Mentorship */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={() => alert('To invite this professional, please go to your Team Workspace and click "Invite Members".')}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
          >
            Invite
          </Button>

          <SecondaryButton
            size="sm"
            disabled={isFull || mentor.status === 'NOT_AVAILABLE'}
            onClick={() => {
              if (onRequestMentorship) onRequestMentorship(mentor.id);
            }}
            className="text-xs font-bold"
          >
            {isFull ? 'Full' : 'Request Mentor'}
          </SecondaryButton>
        </div>

        <button
          onClick={() => navigate(`/candidates/${mentor.id}`)}
          className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-brand-600 flex items-center justify-center gap-1 py-1"
        >
          View Professional Profile <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </Card>
  );
};
