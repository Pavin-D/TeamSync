import React from 'react';
import { AdminUser } from '@/services/api/adminService';
import { Avatar } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { ExternalLink, ShieldAlert, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface UserTableProps {
  users: AdminUser[];
  onSuspend?: (user: AdminUser) => void;
  onEdit?: (user: AdminUser) => void;
  onDelete?: (user: AdminUser) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onSuspend, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: AdminUser['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">✓ Active</span>;
      case 'SUSPENDED':
        return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">⚠ Suspended</span>;
      case 'PENDING':
        return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">◷ Pending</span>;
      default:
        return <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">Deactivated</span>;
    }
  };

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-subtle text-left">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <th className="p-3.5">User</th>
            <th className="p-3.5">Role</th>
            <th className="p-3.5">Institution / Company</th>
            <th className="p-3.5">Joined Date</th>
            <th className="p-3.5">Reports</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {users.map((u) => {
            const uid = u.userId || u.id || '';
            return (
              <tr key={uid || u.email} className="hover:bg-slate-50/80 transition">
                <td className="p-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={u.name} src={u.avatarUrl} size="sm" />
                    <div>
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 font-semibold text-brand-600">{u.role}</td>
                <td className="p-3.5 text-slate-600">{u.college || u.institutionName || u.organization || 'N/A'}</td>
                <td className="p-3.5 text-slate-400 font-mono">{u.joinedDate || (u.createdAt ? u.createdAt.split('T')[0] : 'N/A')}</td>
                <td className="p-3.5">
                  {u.reportsCount > 0 ? (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 w-max ${
                      u.reportsCount >= 30
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      <ShieldAlert className="w-3 h-3" /> {u.reportsCount} Reports
                    </span>
                  ) : (
                    <span className="text-slate-400">0</span>
                  )}
                </td>
                <td className="p-3.5">{getStatusBadge(u.status)}</td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/users/${uid}`)}
                      rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      View
                    </Button>
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(u)}
                        className="text-slate-700 hover:bg-slate-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {onSuspend && u.status === 'ACTIVE' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSuspend(u)}
                        className="border-amber-300 text-amber-800 hover:bg-amber-50"
                      >
                        Suspend
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(u)}
                        className="border-rose-200 text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
