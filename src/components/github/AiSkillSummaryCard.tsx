import React from 'react';
import { Card } from '@/components/ui/Cards';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export interface AiSkillSummaryCardProps {
  summary: string;
}

export const AiSkillSummaryCard: React.FC<AiSkillSummaryCardProps> = ({ summary }) => {
  return (
    <Card className="p-6 text-left bg-gradient-to-r from-brand-600 to-indigo-700 text-white border-none shadow-modal relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-amber-300" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Skill Summary</h3>
      </div>

      <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed mb-4">{summary}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/10 p-3 rounded-2xl border border-white/20">
        <div className="flex items-start gap-1.5 text-white font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>Strongest in Frontend (React, JavaScript)</span>
        </div>
        <div className="flex items-start gap-1.5 text-white font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>Complements teams requiring Python & ML capabilities</span>
        </div>
      </div>
    </Card>
  );
};
