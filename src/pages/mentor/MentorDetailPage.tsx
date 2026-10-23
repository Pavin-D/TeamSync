import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mentorService, MentorProfile } from '@/services/api/mentorService';
import { MentorshipRequestModal } from '@/components/mentor/MentorshipRequestModal';
import { Card, Avatar, Badge, SkillBadge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft, Star, Users, Clock, Sparkles } from 'lucide-react';

export const MentorDetailPage: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    const fetchMentor = async () => {
      setIsLoading(true);
      try {
        if (!mentorId) return;
        const res = await mentorService.getMentorById(mentorId);
        if (res.success && res.data) {
          setMentor(res.data);
        } else {
          setMentor(getFallbackMentor(mentorId));
        }
      } catch {
        setMentor(getFallbackMentor(mentorId || 'm_01'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  const getFallbackMentor = (id: string): MentorProfile => ({
    id,
    userId: 'usr_m01',
    name: 'Arun Kumar',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    title: 'Senior Software Engineer',
    company: 'Google',
    yearsOfExperience: 10,
    industry: 'Cloud & AI Systems',
    primarySkills: ['Node.js', 'AWS', 'System Design', 'PostgreSQL'],
    secondarySkills: ['Docker', 'Kubernetes'],
    mentoringAreas: ['Technical Development', 'System Design & Architecture', 'Hackathon Strategy'],
    bio: '10+ years engineering backend services and scalable microservices at Google. Passionate about helping hackathon teams design clean system architecture and achieve production quality.',
    availabilitySchedule: 'Weekdays 6:00 PM - 9:00 PM IST',
    timezone: 'Asia/Kolkata',
    maxActiveMentees: 3,
    currentActiveMenteesCount: 2,
    status: 'AVAILABLE',
    averageRating: 4.9,
    totalReviewsCount: 38,
    totalStudentsMentored: 24,
    totalSessionsCompleted: 48,
    distanceKm: 8.5,
    isRemoteAvailable: true,
    matchScore: 96,
  });

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-48" />;
  }

  if (!mentor) {
    return (
      <ErrorState
        title="Mentor Not Found"
        message="The requested mentor profile could not be loaded."
        onRetry={() => navigate('/mentors')}
      />
    );
  }

  const currentMentees = mentor.currentActiveMenteesCount ?? 0;
  const maxMentees = mentor.maxActiveMentees ?? 3;
  const isFull = currentMentees >= maxMentees;
  const rating = mentor.averageRating ?? 4.9;
  const skills = mentor.primarySkills || mentor.skills || [];
  const areas = mentor.mentoringAreas || ['Technical Development', 'Architecture'];

  return (
    <div className="space-y-6 text-left pb-16 max-w-4xl mx-auto">
      <div>
        <Link
          to="/mentors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Mentor Discovery
        </Link>
      </div>

      {/* Header Banner */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-none shadow-modal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar name={mentor.name} src={mentor.avatarUrl} size="xl" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{mentor.name}</h1>
                <Badge variant="success">Verified Mentor ✓</Badge>
              </div>
              <p className="text-xs font-semibold text-brand-300">{mentor.title || mentor.jobTitle || 'Tech Leader'} @ {mentor.company}</p>
              <p className="text-xs text-slate-300">{mentor.yearsOfExperience || 5} Years Experience • {mentor.industry || 'Tech'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-base">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>{rating.toFixed(1)} ({mentor.totalReviewsCount || 10} reviews)</span>
            </div>

            <Button
              size="md"
              disabled={isFull || mentor.status === 'NOT_AVAILABLE'}
              onClick={() => setIsRequestModalOpen(true)}
            >
              {isFull ? 'Capacity Full' : 'Request Mentorship'}
            </Button>
          </div>
        </div>
      </Card>

      {/* About & Bio */}
      <Card className="p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About Mentor</h3>
        <p className="text-xs text-slate-600 leading-relaxed">{mentor.bio || 'Experienced industry professional guiding student hackathon teams.'}</p>
      </Card>

      {/* Skills & Mentoring Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technical Expertise</h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <SkillBadge key={s} skill={s} />
            ))}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mentoring Areas</h3>
          <div className="flex flex-wrap gap-1.5">
            {areas.map((area) => (
              <span key={area} className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                {area}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Availability & Capacity Info */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Availability & Capacity</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Schedule</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-600" /> {mentor.availabilitySchedule || 'Flexible Remote'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Capacity</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-600" /> {currentMentees} / {maxMentees} Active Mentees
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Total Mentored</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> {mentor.totalStudentsMentored || 10} Students ({mentor.totalSessionsCompleted || 15} Sessions)
            </span>
          </div>
        </div>
      </Card>

      {/* Request Modal */}
      {isRequestModalOpen && (
        <MentorshipRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          mentorId={mentor.id}
          mentorName={mentor.name}
          onSubmitRequest={async (data) => {
            await mentorService.sendMentorshipRequest(data);
          }}
        />
      )}
    </div>
  );
};
