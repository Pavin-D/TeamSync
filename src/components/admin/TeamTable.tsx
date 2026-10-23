import React from 'react';
import { AdminTeam } from '@/services/api/adminService';
import { Button } from '@/components/ui/Button';
import { ExternalLink, ShieldAlert, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface TeamTableProps {
  teams: AdminTeam[];
  onEdit?: (team: AdminTeam) => void;
  onDelete?: (team: AdminTeam) => void;
}

export const TeamTable: React.FC<TeamTableProps> = ({ teams, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-subtle text-left">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <th className="p-3.5">Team Name</th>
            <th className="p-3.5">Event</th>
            <th className="p-3.5">Team Lead</th>
            <th className="p-3.5 text-center">Members</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5">Reports</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {teams.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50/80 transition">
              <td className="p-3.5 font-bold text-slate-900">{t.name || t.teamName}</td>
              <td className="p-3.5 text-brand-600 font-medium">{t.eventName}</td>
              <td className="p-3.5 text-slate-700">{t.teamLeadName}</td>
              <td className="p-3.5 text-center font-bold text-slate-800">{t.membersCount}</td>
              <td className="p-3.5">
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                  {t.status}
                </span>
              </td>
              <td className="p-3.5">
                {t.reportsCount > 0 ? (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                    <ShieldAlert className="w-3 h-3 text-rose-600" /> {t.reportsCount} Reports
                  </span>
                ) : (
                  <span className="text-slate-400">0</span>
                )}
              </td>
              <td className="p-3.5 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/teams/${t.id}`)}
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    View Team
                  </Button>
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(t)}
                      className="text-slate-700 hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(t)}
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
