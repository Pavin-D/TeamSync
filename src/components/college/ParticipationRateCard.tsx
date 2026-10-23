import React from 'react';
import { Card } from '@/components/ui/Cards';
import { GraduationCap } from 'lucide-react';

export interface ParticipationRateCardProps {
  totalStudents: number;
  participatingStudents: number;
  participationRate: number;
}

export const ParticipationRateCard: React.FC<ParticipationRateCardProps> = ({
  totalStudents,
  participatingStudents,
  participationRate,
}) => {
  return (
    <Card className="p-5 bg-gradient-to-r from-brand-600 to-indigo-700 text-white rounded-2xl shadow-subtle text-left space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-200" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-100">
            Student Hackathon Participation Rate
          </h4>
        </div>
        <span className="text-xl font-extrabold text-white font-mono">{participationRate}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <div
          className="bg-emerald-400 h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(participationRate, 100)}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-brand-100 font-medium">
        <span>Active Participants: <strong className="text-white">{participatingStudents}</strong></span>
        <span>Total Enrolled: <strong className="text-white">{totalStudents}</strong></span>
      </div>
    </Card>
  );
};
