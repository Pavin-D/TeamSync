import React from 'react';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { TrendingUp, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface AdminStatCardProps {
  label: string;
  value?: number | string;
  trend?: string;
  icon?: LucideIcon;
  isLoading?: boolean;
  linkTo?: string;
  isAlert?: boolean;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  trend,
  icon: Icon,
  isLoading = false,
  linkTo,
  isAlert = false,
}) => {
  return (
    <Card
      className={`p-4 text-left space-y-2 transition ${
        isAlert
          ? 'bg-rose-50/50 border-rose-200 shadow-subtle'
          : 'bg-white border-slate-200 shadow-subtle'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        {Icon && <Icon className={`w-4 h-4 shrink-0 ${isAlert ? 'text-rose-600' : 'text-brand-600'}`} />}
      </div>

      {isLoading ? (
        <SkeletonLoader variant="text" className="h-6 w-20" />
      ) : (
        <div className="space-y-1">
          <span className={`text-2xl font-extrabold font-mono block ${isAlert ? 'text-rose-600' : 'text-slate-900'}`}>
            {typeof value === 'number' ? value.toLocaleString() : value || 0}
          </span>

          {trend && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {trend}
            </span>
          )}

          {linkTo && (
            <Link to={linkTo} className="text-[11px] font-semibold text-brand-600 hover:underline block pt-1">
              Manage →
            </Link>
          )}
        </div>
      )}
    </Card>
  );
};
