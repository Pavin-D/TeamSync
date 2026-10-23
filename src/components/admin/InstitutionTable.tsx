import React from 'react';
import { AdminInstitution } from '@/services/api/adminService';
import { Button } from '@/components/ui/Button';
import { ExternalLink, CheckCircle2, Clock, XCircle, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface InstitutionTableProps {
  institutions: AdminInstitution[];
  onVerify?: (inst: AdminInstitution, status: 'VERIFIED' | 'REJECTED') => void;
  onEdit?: (inst: AdminInstitution) => void;
  onDelete?: (inst: AdminInstitution) => void;
}

export const InstitutionTable: React.FC<InstitutionTableProps> = ({ institutions, onVerify, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-subtle text-left">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <th className="p-3.5">Rank</th>
            <th className="p-3.5">Institution Name</th>
            <th className="p-3.5">Location</th>
            <th className="p-3.5 text-center">Students</th>
            <th className="p-3.5 text-center">Events</th>
            <th className="p-3.5 text-center">Wins 🏆</th>
            <th className="p-3.5">Verification</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {institutions.map((inst) => {
            const cid = inst.collegeId || inst.id || '';
            const isVerified = inst.isVerified || inst.verificationStatus === 'VERIFIED';
            const isRejected = inst.verificationStatus === 'REJECTED';

            return (
              <tr key={cid || inst.name} className="hover:bg-slate-50/80 transition">
                <td className="p-3.5 font-extrabold text-slate-900 font-mono">#{inst.rank || '-'}</td>
                <td className="p-3.5 font-bold text-slate-900">{inst.collegeName || inst.name}</td>
                <td className="p-3.5 text-slate-500">{inst.location}</td>
                <td className="p-3.5 text-center font-bold text-slate-800">{inst.totalStudents || inst.studentsCount || 0}</td>
                <td className="p-3.5 text-center font-bold text-slate-800">{inst.eventsCount || 0}</td>
                <td className="p-3.5 text-center font-extrabold text-amber-600">{inst.winsCount || 0}</td>
                <td className="p-3.5">
                  {isVerified ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  ) : isRejected ? (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                      <XCircle className="w-3 h-3 text-rose-600" /> Rejected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                      <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/colleges/${cid}`)}
                      rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      View
                    </Button>
                    {onVerify && !isVerified && (
                      <Button
                        size="sm"
                        onClick={() => onVerify(inst, 'VERIFIED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Approve
                      </Button>
                    )}
                    {onVerify && !isRejected && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onVerify(inst, 'REJECTED')}
                        className="border-rose-300 text-rose-700 hover:bg-rose-50"
                      >
                        Reject
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(inst)}
                        className="text-slate-700 hover:bg-slate-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(inst)}
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
