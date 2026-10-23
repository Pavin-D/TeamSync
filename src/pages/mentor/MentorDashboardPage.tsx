import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mentorService, MentorshipRequest, ActiveMentorship } from '@/services/api/mentorService';
import { Card, Badge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Award, Inbox, CheckCircle2, XCircle, ArrowRight, Settings } from 'lucide-react';

export const MentorDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [activeMentorships, setActiveMentorships] = useState<ActiveMentorship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const [reqRes, actRes] = await Promise.all([
          mentorService.getMentorshipRequests(),
          mentorService.getActiveMentorships(),
        ]);

        if (reqRes.success && reqRes.data) setRequests(reqRes.data);
        else setRequests([]);

        if (actRes.success && actRes.data) setActiveMentorships(actRes.data.filter((a) => a.status === 'ACCEPTED' || a.status === 'ACTIVE'));
        else setActiveMentorships([]);
      } catch {
        setRequests([]);
        setActiveMentorships([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleAcceptRequest = async (reqId: string) => {
    await mentorService.acceptMentorshipRequest(reqId);
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  const handleRejectRequest = async (reqId: string) => {
    await mentorService.rejectMentorshipRequest(reqId);
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  if (isLoading) {
    return <SkeletonLoader variant="card" count={3} />;
  }

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Professional Mentor Dashboard</h1>
            <p className="text-xs text-slate-500">Manage mentee requests, upcoming guidance sessions, and availability</p>
          </div>
        </div>

        <Button onClick={() => navigate('/mentor/setup')} leftIcon={<Settings className="w-4 h-4" />}>
          Edit Mentor Profile
        </Button>
      </div>

      {/* Pending Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900">Pending Mentorship Requests ({requests.length})</h2>
        </div>

        {requests.length === 0 ? (
          <Card className="p-8 text-center bg-slate-50">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-900">No Pending Requests</h4>
            <p className="text-xs text-slate-500">You currently have no pending applicant requests from student teams.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <Card key={req.id} className="p-5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{req.teamName || req.menteeName}</h4>
                      <p className="text-xs text-slate-500">{req.eventTitle || 'Hackathon Team'}</p>
                    </div>
                    <Badge variant="primary">PENDING</Badge>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl italic">"{req.message || 'Team requests mentorship'}"</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    fullWidth
                    onClick={() => handleAcceptRequest(req.id)}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Accept
                  </Button>
                  <SecondaryButton
                    size="sm"
                    fullWidth
                    onClick={() => handleRejectRequest(req.id)}
                    leftIcon={<XCircle className="w-4 h-4 text-rose-500" />}
                  >
                    Reject
                  </SecondaryButton>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Active Mentees Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Active Mentorships ({activeMentorships.length})</h2>
        </div>

        {activeMentorships.length === 0 ? (
          <Card className="p-8 text-center bg-slate-50">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-900">No Active Mentorship Teams</h4>
            <p className="text-xs text-slate-500">You are not actively mentoring any hackathon teams right now.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMentorships.map((act) => (
              <Card key={act.id} className="p-5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{act.teamName || act.menteeName}</h4>
                      <p className="text-xs text-slate-500">{act.eventTitle || 'Event Team'}</p>
                    </div>
                    <Badge variant="success">Active Mentorship</Badge>
                  </div>
                </div>

                <Button
                  size="sm"
                  fullWidth
                  variant="outline"
                  onClick={() => navigate(`/teams/${(act as any).teamId || act.id}`)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Open Mentorship Workspace
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
