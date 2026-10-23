import React from 'react';
import { Card } from '@/components/ui/Cards';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

export interface ComplementarySkillComparisonProps {
  userSkills: string[];
  candidateSkills: string[];
  candidateName: string;
}

export const ComplementarySkillComparison: React.FC<ComplementarySkillComparisonProps> = ({
  userSkills,
  candidateSkills,
  candidateName,
}) => {
  return (
    <Card className="p-5 text-left space-y-3 bg-slate-50 border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-brand-600">
          <Sparkles className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Skill Complementarity Comparison</h4>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Optimal Technical Coverage
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
        <div className="p-3 bg-white rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Your Current Team Skills</span>
          <div className="flex flex-wrap gap-1">
            {userSkills.map((s) => (
              <span key={s} className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> {s}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-200/80">
          <span className="text-[10px] font-bold uppercase text-brand-700 block mb-1.5 flex items-center justify-between">
            <span>{candidateName}'s Complementary Skills</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
          </span>
          <div className="flex flex-wrap gap-1">
            {candidateSkills.map((s) => (
              <span key={s} className="text-xs font-bold text-brand-800 bg-white px-2 py-0.5 rounded-md border border-brand-200 shadow-subtle">
                + {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
