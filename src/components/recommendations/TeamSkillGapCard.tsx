import React from 'react';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Sparkles } from 'lucide-react';

export interface TeamSkillGapCardProps {
  currentSkills: { name: string; coveragePercentage: number }[];
  missingCriticalSkills: string[];
  onFindMatchingCandidates?: () => void;
}

export const TeamSkillGapCard: React.FC<TeamSkillGapCardProps> = ({
  currentSkills,
  missingCriticalSkills,
  onFindMatchingCandidates,
}) => {
  return (
    <Card className="p-5 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Team Skill Gap Analysis</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Event Requirements Coverage</span>
      </div>

      {/* Existing Coverage */}
      <div className="space-y-2 text-xs">
        {currentSkills.map((sk) => (
          <div key={sk.name} className="space-y-1">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>{sk.name}</span>
              <span>{sk.coveragePercentage}% Covered</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 rounded-full" style={{ width: `${sk.coveragePercentage}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Missing Critical Skills */}
      {missingCriticalSkills.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
          <span className="text-[10px] font-bold uppercase text-amber-800 block">Missing High-Priority Skills:</span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {missingCriticalSkills.map((s) => (
              <span key={s} className="font-bold text-amber-900 bg-white px-2 py-0.5 rounded-md border border-amber-300">
                ⚠ {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {onFindMatchingCandidates && (
        <Button
          size="sm"
          fullWidth
          onClick={onFindMatchingCandidates}
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
        >
          Find Candidates for These Skills
        </Button>
      )}
    </Card>
  );
};
