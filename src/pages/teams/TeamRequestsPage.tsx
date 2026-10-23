import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teamService, TeamRequest } from '@/services/api/teamService';
import { TeamRequestCard } from '@/components/teams/TeamRequestCard';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { ArrowLeft, Inbox } from 'lucide-react';

export const TeamRequestsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();

  const [requests, setRequests] = useState<TeamRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        if (!teamId) return;
        const res = await teamService.getTeamRequests(teamId);
        if (res.success && res.data) {
          setRequests(res.data);
        } else {
          setRequests([]);
        }
      } catch {
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [teamId]);

  const handleAccept = async (reqId: string) => {
    if (!teamId) return;
    await teamService.acceptJoinRequest(reqId);
    setRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status: 'ACCEPTED' } : r)));
  };

  const handleReject = async (reqId: string) => {
    if (!teamId) return;
    await teamService.rejectJoinRequest(reqId);
    setRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status: 'REJECTED' } : r)));
  };

  return (
    <div className="space-y-6 text-left pb-16 max-w-4xl mx-auto">
      <div>
        <Link
          to={`/teams/${teamId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Team Overview
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Manage Join Requests</h1>
        <p className="text-xs text-slate-500">Review applications submitted by students interested in joining your team</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoader variant="card" count={2} />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Pending Join Requests</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            You currently have no pending applicant requests for this team. Invite candidates directly to accelerate recruitment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <TeamRequestCard key={req.id} request={req} onAccept={handleAccept} onReject={handleReject} />
          ))}
        </div>
      )}
    </div>
  );
};
