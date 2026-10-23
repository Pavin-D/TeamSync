import React from 'react';
import { ParticipationItem } from '@/services/api/studentService';
import { Card, Badge } from '@/components/ui/Cards';
import { History, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ParticipationHistoryPreviewProps {
  history?: ParticipationItem[];
}

export const ParticipationHistoryPreview: React.FC<ParticipationHistoryPreviewProps> = ({
  history = [
    { id: 'p_01', eventName: 'Smart India Hackathon 2026', year: '2026', teamName: 'Innovators AI', result: '1st Place Winner' },
    { id: 'p_02', eventName: 'Global AI Summit Challenge', year: '2025', teamName: 'NeuralForge', result: 'Finalist' },
    { id: 'p_03', eventName: 'Inter-College CodeFest', year: '2025', teamName: 'ByteBusters', result: 'Runner Up' },
  ],
}) => {
  return (
    <Card className="flex flex-col justify-between text-left">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-slate-900">
            <History className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold">Recent Participation History</h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Total 8 Events</span>
        </div>

        <div className="space-y-2.5">
          {history.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
              <div>
                <h4 className="font-bold text-slate-900">{item.eventName}</h4>
                <p className="text-[11px] text-slate-500">Team: {item.teamName} • {item.year}</p>
              </div>
              <Badge variant={item.result.includes('Winner') || item.result.includes('1st') ? 'success' : 'primary'}>
                {item.result}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/student/participation"
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition pt-3 border-t border-slate-100 mt-3"
      >
        <span>View Full Participation History</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </Card>
  );
};
