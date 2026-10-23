import React from 'react';
import { JoinRequestItem, TeamInvitationItem } from '@/services/api/studentService';
import { Card, Badge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Send, MailCheck, Check, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface RequestsAndInvitationsPreviewProps {
  requests?: JoinRequestItem[];
  invitations?: TeamInvitationItem[];
}

export const RequestsAndInvitationsPreview: React.FC<RequestsAndInvitationsPreviewProps> = ({
  requests = [
    { id: 'req_01', teamName: 'AI Robotics Team', eventName: 'Hackathon 2026', requestedDate: '2 days ago', status: 'PENDING' },
    { id: 'req_02', teamName: 'FullStack Pioneers', eventName: 'FinTech Challenge', requestedDate: '1 week ago', status: 'ACCEPTED' },
  ],
  invitations = [
    { id: 'inv_01', teamName: 'Cloud Native Builders', invitedByName: 'Sarah Connor', eventName: 'Cloud Hackathon 2026', invitedDate: 'Yesterday', status: 'PENDING' },
  ],
}) => {
  const getRequestBadge = (status: JoinRequestItem['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'ACCEPTED':
        return <Badge variant="success">Accepted</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
      {/* Join Requests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-800">
            <Send className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">My Join Requests</h3>
          </div>
          <Link to="/student/requests" className="text-xs font-semibold text-brand-600 hover:underline flex items-center">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {requests.map((req) => (
            <Card key={req.id} className="p-3.5 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{req.teamName}</h4>
                <p className="text-[11px] text-slate-500">{req.eventName} • {req.requestedDate}</p>
              </div>
              {getRequestBadge(req.status)}
            </Card>
          ))}
        </div>
      </div>

      {/* Invitations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-800">
            <MailCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Team Invitations</h3>
          </div>
          <Link to="/student/invitations" className="text-xs font-semibold text-brand-600 hover:underline flex items-center">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {invitations.map((inv) => (
            <Card key={inv.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{inv.teamName}</h4>
                <p className="text-[11px] text-slate-500">Invited by {inv.invitedByName} • {inv.invitedDate}</p>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <Button size="sm" className="py-1 px-2.5 text-[11px]" leftIcon={<Check className="w-3 h-3" />}>
                  Accept
                </Button>
                <SecondaryButton size="sm" className="py-1 px-2.5 text-[11px]" leftIcon={<X className="w-3 h-3" />}>
                  Decline
                </SecondaryButton>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
