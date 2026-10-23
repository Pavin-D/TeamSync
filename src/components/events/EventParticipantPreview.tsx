import React from 'react';
import { EventParticipantStats } from '@/services/api/eventService';
import { Card } from '@/components/ui/Cards';
import { Users, GraduationCap, Briefcase, Building2 } from 'lucide-react';

export interface EventParticipantPreviewProps {
  stats: EventParticipantStats;
  className?: string;
}

export const EventParticipantPreview: React.FC<EventParticipantPreviewProps> = ({ stats, className }) => {
  const studentPercentage = Math.round((stats.studentsCount / (stats.totalRegistered || 1)) * 100);
  const professionalPercentage = 100 - studentPercentage;

  return (
    <Card className={`text-left ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Registered Participants</h3>
        </div>
        <span className="text-base font-extrabold text-slate-900">{stats.totalRegistered.toLocaleString()} Registered</span>
      </div>

      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex mb-4">
        <div className="h-full bg-brand-600" style={{ width: `${studentPercentage}%` }} title={`Students: ${studentPercentage}%`} />
        <div className="h-full bg-violet-600" style={{ width: `${professionalPercentage}%` }} title={`Professionals: ${professionalPercentage}%`} />
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] flex items-center gap-1 font-semibold">
            <GraduationCap className="w-3 h-3 text-brand-600" /> Students
          </span>
          <span className="font-extrabold text-slate-900 text-sm">{stats.studentsCount.toLocaleString()}</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] flex items-center gap-1 font-semibold">
            <Briefcase className="w-3 h-3 text-violet-600" /> Professionals
          </span>
          <span className="font-extrabold text-slate-900 text-sm">{stats.professionalsCount.toLocaleString()}</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] flex items-center gap-1 font-semibold">
            <Building2 className="w-3 h-3 text-emerald-600" /> Colleges
          </span>
          <span className="font-extrabold text-slate-900 text-sm">{stats.collegesRepresented}</span>
        </div>
      </div>
    </Card>
  );
};
