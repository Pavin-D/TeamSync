import React from 'react';
import { CollaborationMetrics } from '@/services/api/collegeService';
import { Card } from '@/components/ui/Cards';
import { Users2 } from 'lucide-react';

export interface CollaborationAnalyticsCardProps {
  metrics: CollaborationMetrics;
}

export const CollaborationAnalyticsCard: React.FC<CollaborationAnalyticsCardProps> = ({ metrics }) => {
  return (
    <Card className="p-5 bg-white border-slate-200 shadow-subtle text-left space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Users2 className="w-5 h-5 text-brand-600" />
        <div>
          <h3 className="text-sm font-bold text-slate-900">Inter-Department & Cross-College Collaboration</h3>
          <p className="text-xs text-slate-500">Breakdown of student team composition types</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
          <span className="text-slate-400 font-bold text-[10px] uppercase block">Same Dept Teams</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono">{metrics.sameDepartmentTeams}</span>
        </div>

        <div className="p-3 bg-brand-50/40 rounded-2xl border border-brand-100 space-y-1">
          <span className="text-brand-700 font-bold text-[10px] uppercase block">Cross Dept Teams</span>
          <span className="text-xl font-extrabold text-brand-600 font-mono">{metrics.crossDepartmentTeams}</span>
        </div>

        <div className="p-3 bg-indigo-50/40 rounded-2xl border border-indigo-100 space-y-1">
          <span className="text-indigo-700 font-bold text-[10px] uppercase block">Cross College Teams</span>
          <span className="text-xl font-extrabold text-indigo-600 font-mono">{metrics.crossCollegeTeams}</span>
        </div>

        <div className="p-3 bg-amber-50/40 rounded-2xl border border-amber-100 space-y-1">
          <span className="text-amber-800 font-bold text-[10px] uppercase block">Student + Professional</span>
          <span className="text-xl font-extrabold text-amber-600 font-mono">{metrics.professionalStudentTeams}</span>
        </div>
      </div>
    </Card>
  );
};
