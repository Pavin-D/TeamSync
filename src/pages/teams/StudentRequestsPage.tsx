import React, { useEffect, useState } from 'react';
import { teamService, TeamRequest } from '@/services/api/teamService';
import { Card, Badge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Send, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<TeamRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      setIsLoading(true);
      try {
        const res = await teamService.getMyRequests();
        setRequests(res.data || []);
      } catch {
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  const getBadge = (status: TeamRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Pending Review</Badge>;
      case 'ACCEPTED':
        return <Badge variant="success">Accepted ✓</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-left pb-16">
      <div className="flex items-center gap-2">
        <Send className="w-6 h-6 text-brand-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Join Requests</h1>
          <p className="text-xs text-slate-500">Track applications you have submitted to open hackathon teams</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
          <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Submitted Join Requests</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Browse recruiting teams to request to join a project matching your skills.
          </p>
          <Button onClick={() => navigate('/teams')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore Teams
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <Card key={req.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-base font-bold text-slate-900">{req.teamName}</h4>
                  {getBadge(req.status)}
                </div>

                <p className="text-xs font-semibold text-brand-600 mb-2">{req.eventName}</p>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-3 italic">
                  "{req.message}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Requested: {req.requestedAt}</span>
                <button
                  onClick={() => navigate(`/teams/${req.teamId}`)}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  View Team →
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
