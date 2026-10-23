import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  mentorService,
  ActiveMentorship,
  MentorshipSession,
} from '@/services/api/mentorService';
import { MentorshipGoalTracker } from '@/components/mentor/MentorshipGoalTracker';
import { SessionCard } from '@/components/mentor/SessionCard';
import { ScheduleSessionModal } from '@/components/mentor/ScheduleSessionModal';
import { MentorFeedbackModal } from '@/components/mentor/MentorFeedbackModal';
import { ConfirmationModal } from '@/components/teams/ConfirmationModal';
import { Card, Avatar, Badge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft, Calendar, PlusCircle } from 'lucide-react';

export const ActiveMentorshipPage: React.FC = () => {
  const { mentorshipId } = useParams<{ mentorshipId: string }>();
  const navigate = useNavigate();

  const [mentorship, setMentorship] = useState<ActiveMentorship | null>(null);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  useEffect(() => {
    const fetchMentorship = async () => {
      setIsLoading(true);
      try {
        if (!mentorshipId) return;
        const [mRes, sRes] = await Promise.all([
          mentorService.getMentorshipById(mentorshipId),
          mentorService.getMentorshipSessions(mentorshipId),
        ]);

        if (mRes.success && mRes.data) setMentorship(mRes.data);
        else setMentorship(getFallbackMentorship(mentorshipId));

        if (sRes.success && sRes.data) setSessions(sRes.data);
        else setSessions([]);
      } catch {
        setMentorship(getFallbackMentorship(mentorshipId || 'act_01'));
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorship();
  }, [mentorshipId]);

  const getFallbackMentorship = (id: string): ActiveMentorship => ({
    id,
    mentorId: 'm_01',
    mentorName: 'Industry Mentor',
    mentorTitle: 'Senior Tech Leader',
    mentorCompany: 'Tech Partner',
    menteeId: 'usr_cand_01',
    menteeName: 'Student Team Lead',
    menteeCollege: 'Engineering College',
    teamName: 'Hackathon Team',
    eventName: 'Hackathon Event',
    goalSummary: 'Technical Architecture Review',
    goals: [
      { id: 'g1', title: 'Review System Schemas', isCompleted: true },
      { id: 'g2', title: 'Design Production APIs', isCompleted: false },
    ],
    status: 'ACTIVE',
    startedAt: 'Aug 2026',
    progressPercentage: 50,
  });

  const handleToggleGoal = async (goalId: string, isCompleted: boolean) => {
    if (!mentorship || !mentorship.goals) return;
    const updatedGoals = mentorship.goals.map((g) => (g.id === goalId ? { ...g, isCompleted } : g));
    const completedCount = updatedGoals.filter((g) => g.isCompleted).length;
    const progressPercentage = Math.round((completedCount / updatedGoals.length) * 100);

    setMentorship({
      ...mentorship,
      goals: updatedGoals,
      progressPercentage,
    });

    if (mentorshipId) {
      await mentorService.updateMentorshipGoal(mentorshipId, goalId, isCompleted);
    }
  };

  const handleScheduleSession = async (sessionData: Partial<MentorshipSession>) => {
    if (!mentorshipId) return;
    const res = await mentorService.createMentorshipSession(sessionData);
    const newSession: MentorshipSession = res.data || {
      id: `s_${Date.now()}`,
      mentorshipId,
      date: sessionData.date || 'Aug 20',
      time: sessionData.time || '6:00 PM',
      durationMinutes: sessionData.durationMinutes || 45,
      topic: sessionData.topic || 'Mentorship Guidance Session',
      status: 'SCHEDULED',
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleEndMentorship = async () => {
    if (!mentorshipId) return;
    await mentorService.endMentorship(mentorshipId);
    setIsEndModalOpen(false);
    setIsFeedbackModalOpen(true);
  };

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-48" />;
  }

  if (!mentorship) {
    return (
      <ErrorState
        title="Mentorship Not Found"
        message="The requested mentorship workspace could not be loaded."
        onRetry={() => navigate('/mentors')}
      />
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      <div>
        <Link
          to="/mentor/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Active Mentorship Workspace</h1>
      </div>

      {/* Header Banner */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-none shadow-modal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar name={mentorship.mentorName || 'Mentor'} src={mentorship.mentorAvatarUrl} size="xl" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">Mentor: {mentorship.mentorName}</h2>
                <Badge variant="success">Active Mentorship</Badge>
              </div>
              <p className="text-xs text-brand-300 font-semibold">{mentorship.mentorTitle} @ {mentorship.mentorCompany}</p>
              <p className="text-xs text-slate-300">Mentee: {mentorship.menteeName} ({mentorship.menteeCollege || 'College'})</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsScheduleModalOpen(true)}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Schedule Session
            </Button>
            <SecondaryButton
              size="sm"
              onClick={() => setIsEndModalOpen(true)}
              className="border-white/30 text-white hover:bg-white/10"
            >
              End Mentorship
            </SecondaryButton>
          </div>
        </div>
      </Card>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* Goals Tracker */}
          <MentorshipGoalTracker goals={mentorship.goals || []} onToggleGoal={handleToggleGoal} />

          {/* Sessions Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Mentorship Sessions ({sessions.length})</h3>
              <Button size="sm" onClick={() => setIsScheduleModalOpen(true)} leftIcon={<Calendar className="w-3.5 h-3.5" />}>
                New Session
              </Button>
            </div>

            <div className="space-y-4">
              {sessions.map((s) => (
                <SessionCard
                  key={s.id}
                  session={s}
                  onJoin={() => alert(`Launching video session: ${s.topic}`)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Shared Context */}
        <div className="space-y-6">
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Shared Hackathon Context</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Event</span>
                <span className="font-bold text-brand-600 truncate max-w-[150px]">{mentorship.eventName || mentorship.eventTitle || 'Event'}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Team</span>
                <span className="font-bold text-slate-900">{mentorship.teamName || 'Team'}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Started Date</span>
                <span className="font-bold text-slate-900">{mentorship.startedAt || 'Recently'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Schedule Session Modal */}
      {isScheduleModalOpen && (
        <ScheduleSessionModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          mentorshipId={mentorship.id}
          onSchedule={handleScheduleSession}
        />
      )}

      {/* End Mentorship Modal */}
      <ConfirmationModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        title="End Active Mentorship"
        message="Are you sure you want to end this active mentorship relationship? You will be prompted to leave feedback."
        confirmLabel="End & Leave Feedback"
        onConfirm={handleEndMentorship}
      />

      {/* Feedback Modal */}
      {isFeedbackModalOpen && (
        <MentorFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => {
            setIsFeedbackModalOpen(false);
            navigate('/mentorship/history');
          }}
          mentorshipId={mentorship.id}
          mentorId={mentorship.mentorId || ''}
          mentorName={mentorship.mentorName || 'Mentor'}
          onSubmitFeedback={async (data) => {
            await mentorService.submitMentorFeedback(data);
          }}
        />
      )}
    </div>
  );
};
