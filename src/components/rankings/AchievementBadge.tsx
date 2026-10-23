import React from 'react';
import { Trophy, Award, Star, Crown, Zap } from 'lucide-react';

export interface AchievementBadgeProps {
  title: string;
  type?: 'WINNER' | 'TOP_PERFORMER' | 'TEN_PLUS_EVENTS' | 'TEAM_LEADER' | 'FINALIST';
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ title, type = 'WINNER' }) => {
  const getIcon = () => {
    switch (type) {
      case 'WINNER':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'TOP_PERFORMER':
        return <Award className="w-4 h-4 text-emerald-500" />;
      case 'TEN_PLUS_EVENTS':
        return <Zap className="w-4 h-4 text-brand-500" />;
      case 'TEAM_LEADER':
        return <Crown className="w-4 h-4 text-purple-500" />;
      default:
        return <Star className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2.5 text-left text-xs font-semibold text-slate-800 shadow-subtle hover:bg-slate-100/80 transition">
      <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-subtle">{getIcon()}</div>
      <span>{title}</span>
    </div>
  );
};
