import React, { useEffect, useState } from 'react';
import { teamService, TeamInvitation } from '@/services/api/teamService';
import { TeamInvitationCard } from '@/components/teams/TeamInvitationCard';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Button } from '@/components/ui/Button';
import { MailCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentInvitationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      setIsLoading(true);
      try {
        const res = await teamService.getMyInvitations();
        setInvitations(res.data || []);
      } catch {
        setInvitations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const handleAccept = async (invId: string) => {
    await teamService.acceptInvitation(invId);
    setInvitations((prev) => prev.map((i) => (i.id === invId ? { ...i, status: 'ACCEPTED' } : i)));
  };

  const handleDecline = async (invId: string) => {
    await teamService.declineInvitation(invId);
    setInvitations((prev) => prev.map((i) => (i.id === invId ? { ...i, status: 'DECLINED' } : i)));
  };

  return (
    <div className="space-y-6 text-left pb-16">
      <div className="flex items-center gap-2">
        <MailCheck className="w-6 h-6 text-emerald-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Invitations</h1>
          <p className="text-xs text-slate-500">Review and accept invitations sent by Team Leads</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : invitations.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
          <MailCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Pending Invitations</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            You currently have no pending invitations. Explore open teams or complete your profile to increase visibility.
          </p>
          <Button onClick={() => navigate('/teams')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore Teams
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {invitations.map((inv) => (
            <TeamInvitationCard
              key={inv.id}
              invitation={inv}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
        </div>
      )}
    </div>
  );
};
