import React from 'react';
import { EventPrize } from '@/services/api/eventService';
import { Card } from '@/components/ui/Cards';
import { Trophy, Award, Gift, Briefcase } from 'lucide-react';

export interface EventPrizesProps {
  prizes?: EventPrize[];
  className?: string;
}

export const EventPrizes: React.FC<EventPrizesProps> = ({
  prizes = [
    { title: '1st Place Winner', reward: '₹1,00,000', type: 'CASH', description: 'Plus Fast-track Internship Interview + Mentorship' },
    { title: '2nd Place Runner Up', reward: '₹50,000', type: 'CASH', description: 'Plus Certificate of Excellence + Swag Box' },
    { title: '3rd Place', reward: '₹25,000', type: 'CASH', description: 'Plus Certificate of Excellence' },
  ],
  className,
}) => {
  const getIcon = (title: string, type: EventPrize['type']) => {
    if (title.includes('1st')) return <Trophy className="w-6 h-6 text-amber-500" />;
    if (title.includes('2nd')) return <Trophy className="w-6 h-6 text-slate-400" />;
    if (title.includes('3rd')) return <Trophy className="w-6 h-6 text-amber-700" />;
    if (type === 'INTERNSHIP') return <Briefcase className="w-6 h-6 text-brand-600" />;
    if (type === 'SWAG') return <Gift className="w-6 h-6 text-violet-600" />;
    return <Award className="w-6 h-6 text-emerald-600" />;
  };

  return (
    <Card className={`text-left ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Prizes & Rewards</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {prizes.map((p, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col justify-between space-y-2 hover:border-brand-300 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{p.title}</span>
              {getIcon(p.title, p.type)}
            </div>

            <div className="text-xl font-extrabold text-slate-900 tracking-tight">{p.reward}</div>

            {p.description && <p className="text-[11px] text-slate-500 leading-snug">{p.description}</p>}
          </div>
        ))}
      </div>
    </Card>
  );
};
