import React from 'react';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { TrendingUp, LucideIcon } from 'lucide-react';

export interface CollegeStatCardProps {
  label: string;
  value?: string | number;
  trend?: string;
  icon?: LucideIcon;
  isLoading?: boolean;
}

export const CollegeStatCard: React.FC<CollegeStatCardProps> = ({
  label,
  value,
  trend,
  icon: Icon,
  isLoading = false,
}) => {
  return (
    <Card className="p-4 bg-white border-slate-200 shadow-subtle text-left space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-brand-600 shrink-0" />}
      </div>

      {isLoading ? (
        <SkeletonLoader variant="text" className="h-6 w-20" />
      ) : (
        <div className="space-y-1">
          <span className="text-2xl font-extrabold text-slate-900 font-mono block">
            {typeof value === 'number' ? value.toLocaleString() : value || 0}
          </span>

          {trend && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {trend}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
