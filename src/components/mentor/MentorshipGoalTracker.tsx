import React from 'react';
import { Card } from '@/components/ui/Cards';
import { MentorshipGoal } from '@/services/api/mentorService';
import { CheckCircle2, Circle, Target } from 'lucide-react';

export interface MentorshipGoalTrackerProps {
  goals: MentorshipGoal[];
  onToggleGoal?: (goalId: string, isCompleted: boolean) => void;
}

export const MentorshipGoalTracker: React.FC<MentorshipGoalTrackerProps> = ({
  goals,
  onToggleGoal,
}) => {
  const completedCount = goals.filter((g) => g.isCompleted).length;
  const progressPercentage = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <Card className="p-5 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mentorship Goals & Milestones</h3>
        </div>
        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
          {progressPercentage}% Progress
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Goals Checklist */}
      <div className="space-y-2 text-xs">
        {goals.map((goal) => (
          <button
            key={goal.id}
            type="button"
            onClick={() => onToggleGoal && onToggleGoal(goal.id, !goal.isCompleted)}
            className={`w-full text-left p-3 rounded-xl border flex items-center gap-2.5 transition ${
              goal.isCompleted
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {goal.isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span className={goal.isCompleted ? 'line-through text-slate-500' : 'text-slate-800 font-medium'}>
              {goal.title}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
};
