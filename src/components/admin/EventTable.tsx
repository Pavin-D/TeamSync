import React from 'react';
import { AdminEvent } from '@/services/api/adminService';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface EventTableProps {
  events: AdminEvent[];
  onView?: (event: AdminEvent) => void;
  onEdit?: (event: AdminEvent) => void;
  onDelete?: (event: AdminEvent) => void;
}

export const EventTable: React.FC<EventTableProps> = ({ events, onView, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: AdminEvent['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">● Active</span>;
      case 'UPCOMING':
        return <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">Upcoming</span>;
      case 'COMPLETED':
        return <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">Completed</span>;
      default:
        return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">Cancelled</span>;
    }
  };

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-subtle text-left">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <th className="p-3.5">Event Name</th>
            <th className="p-3.5">Organizer</th>
            <th className="p-3.5 text-center">Participants</th>
            <th className="p-3.5 text-center">Teams</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5">Date</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {events.map((e) => (
            <tr key={e.id} className="hover:bg-slate-50/80 transition">
              <td className="p-3.5 font-bold text-slate-900">{e.title}</td>
              <td className="p-3.5 text-slate-600 font-medium">{e.organizer}</td>
              <td className="p-3.5 text-center font-bold text-slate-800">{e.participantsCount}</td>
              <td className="p-3.5 text-center font-bold text-brand-600">{e.teamsCount}</td>
              <td className="p-3.5">{getStatusBadge(e.status)}</td>
              <td className="p-3.5 text-slate-400 font-mono">{e.date}</td>
              <td className="p-3.5 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => (onView ? onView(e) : navigate(`/events/${e.id}`))}
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    View
                  </Button>
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(e)}
                      className="text-slate-700 hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(e)}
                      className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
