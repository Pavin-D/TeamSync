import React from 'react';
import { MentorshipSession } from '@/services/api/mentorService';
import { Card, Badge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, Video } from 'lucide-react';

export interface SessionCardProps {
  session: MentorshipSession;
  onJoin?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onJoin }) => {
  const getStatusBadge = (status: MentorshipSession['status']) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge variant="primary">Upcoming Session</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed ✓</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <Card className="p-4 flex flex-col justify-between text-left space-y-3">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-bold text-slate-900">{session.topic}</h4>
          {getStatusBadge(session.status)}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
          <span className="flex items-center gap-1 font-semibold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-brand-600" /> {session.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {session.time} ({session.durationMinutes} mins)
          </span>
        </div>

        {session.notes && (
          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl italic">
            "{session.notes}"
          </p>
        )}
      </div>

      {session.status === 'SCHEDULED' && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Button
            size="sm"
            onClick={onJoin}
            leftIcon={<Video className="w-3.5 h-3.5" />}
          >
            Join Mentorship Video Call
          </Button>
          <span className="text-[10px] text-slate-400 font-medium">Link active 5m prior</span>
        </div>
      )}
    </Card>
  );
};
