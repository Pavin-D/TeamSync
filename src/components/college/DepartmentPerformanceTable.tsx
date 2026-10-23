import React from 'react';
import { DepartmentSummary } from '@/services/api/collegeService';
import { Button } from '@/components/ui/Button';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface DepartmentPerformanceTableProps {
  departments: DepartmentSummary[];
}

export const DepartmentPerformanceTable: React.FC<DepartmentPerformanceTableProps> = ({ departments }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-subtle text-left">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <th className="p-3.5">Rank</th>
            <th className="p-3.5">Department</th>
            <th className="p-3.5 text-center">Enrolled</th>
            <th className="p-3.5 text-center">Participants</th>
            <th className="p-3.5 text-center">Rate</th>
            <th className="p-3.5 text-center">Wins 🏆</th>
            <th className="p-3.5 text-center">Finalists ⭐</th>
            <th className="p-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {departments.map((d) => (
            <tr key={d.departmentId} className="hover:bg-slate-50/80 transition">
              <td className="p-3.5 font-extrabold text-slate-900 font-mono">#{d.rank}</td>
              <td className="p-3.5 font-bold text-slate-900">{d.departmentName}</td>
              <td className="p-3.5 text-center text-slate-600">{d.totalStudents}</td>
              <td className="p-3.5 text-center font-bold text-slate-800">{d.participatingStudents}</td>
              <td className="p-3.5 text-center font-bold text-brand-600">{d.participationRate}%</td>
              <td className="p-3.5 text-center font-extrabold text-amber-600">{d.wins}</td>
              <td className="p-3.5 text-center font-extrabold text-indigo-600">{d.finalists}</td>
              <td className="p-3.5 text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/college/departments/${d.departmentId}`)}
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
