import React from 'react';
import { Card } from '@/components/ui/Cards';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

export interface ProgressStep {
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface GitHubAnalysisProgressProps {
  percentage: number;
  steps?: ProgressStep[];
}

export const GitHubAnalysisProgress: React.FC<GitHubAnalysisProgressProps> = ({
  percentage,
  steps = [
    { label: 'GitHub profile retrieved', isCompleted: percentage >= 20, isCurrent: percentage < 20 },
    { label: 'Repositories analyzed', isCompleted: percentage >= 40, isCurrent: percentage >= 20 && percentage < 40 },
    { label: 'Languages detected', isCompleted: percentage >= 60, isCurrent: percentage >= 40 && percentage < 60 },
    { label: 'Dependencies analyzed', isCompleted: percentage >= 80, isCurrent: percentage >= 60 && percentage < 80 },
    { label: 'Building AI skill profile...', isCompleted: percentage >= 100, isCurrent: percentage >= 80 },
  ],
}) => {
  return (
    <Card className="p-6 text-left space-y-4 bg-slate-900 text-white border-none shadow-modal">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Analyzing GitHub Profile</h3>
        <span className="text-sm font-extrabold text-brand-400">{percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Progress Steps */}
      <div className="space-y-2.5 pt-2 text-xs">
        {steps.map((s, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {s.isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : s.isCurrent ? (
              <Loader2 className="w-4 h-4 text-brand-400 animate-spin shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
            )}
            <span className={s.isCompleted ? 'text-slate-200' : s.isCurrent ? 'text-brand-300 font-bold' : 'text-slate-500'}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
