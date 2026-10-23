import React from 'react';
import { StatCard } from '@/components/ui/Cards';
import { Users, Calendar, CheckCircle2, Sparkles } from 'lucide-react';

export interface StudentQuickStatsProps {
  activeTeamsCount?: number;
  upcomingEventsCount?: number;
  profileCompletionPercentage?: number;
  skillMatchScore?: number;
}

export const StudentQuickStats: React.FC<StudentQuickStatsProps> = ({
  activeTeamsCount = 2,
  upcomingEventsCount = 3,
  profileCompletionPercentage = 85,
  skillMatchScore = 78,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Active Teams"
        value={activeTeamsCount}
        change="+1 this month"
        icon={<Users className="w-5 h-5 text-brand-600" />}
      />

      <StatCard
        title="Upcoming Events"
        value={upcomingEventsCount}
        description="2 Registration closing"
        icon={<Calendar className="w-5 h-5 text-emerald-600" />}
      />

      <StatCard
        title="Profile Completion"
        value={`${profileCompletionPercentage}%`}
        change="Missing 2 items"
        isPositive={profileCompletionPercentage >= 80}
        icon={<CheckCircle2 className="w-5 h-5 text-accent-600" />}
      />

      <StatCard
        title="Skill Match Score"
        value={`${skillMatchScore}/100`}
        change="Top 15% compatibility"
        icon={<Sparkles className="w-5 h-5 text-amber-600" />}
      />
    </div>
  );
};
