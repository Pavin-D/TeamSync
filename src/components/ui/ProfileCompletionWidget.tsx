import React from 'react';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ProfileItem {
  id: string;
  label: string;
  isComplete: boolean;
  actionPath?: string;
}

export interface ProfileCompletionWidgetProps {
  items?: ProfileItem[];
  className?: string;
}

export const ProfileCompletionWidget: React.FC<ProfileCompletionWidgetProps> = ({
  items = [
    { id: '1', label: 'Connect GitHub profile', isComplete: true },
    { id: '2', label: 'Add LinkedIn profile', isComplete: true },
    { id: '3', label: 'Select primary skills', isComplete: true },
    { id: '4', label: 'Set approximate location discovery', isComplete: false },
    { id: '5', label: 'Complete department & year info', isComplete: true },
  ],
  className,
}) => {
  const navigate = useNavigate();

  const completedCount = items.filter((i) => i.isComplete).length;
  const percentage = Math.round((completedCount / items.length) * 100);

  return (
    <Card className={className}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">Profile Completion</h3>
          </div>
          <p className="text-xs text-slate-500">
            Complete your profile to improve AI teammate recommendations & visibility
          </p>
        </div>
        <span className="text-base font-extrabold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-xl border border-brand-100 shrink-0">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-accent-600 transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              {item.isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span className={item.isComplete ? 'text-slate-700 font-medium line-through opacity-75' : 'text-slate-900 font-semibold'}>
                {item.label}
              </span>
            </div>
            {!item.isComplete && (
              <button
                onClick={() => navigate('/student/profile/edit')}
                className="text-[11px] font-semibold text-brand-600 hover:underline"
              >
                Add now
              </button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        fullWidth
        onClick={() => navigate('/student/profile')}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Edit Full Profile
      </Button>
    </Card>
  );
};
