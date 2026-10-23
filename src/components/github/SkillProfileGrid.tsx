import React, { useState } from 'react';
import { SkillItem } from '@/services/api/skillService';
import { Card } from '@/components/ui/Cards';
import { SkillEvidenceModal } from './SkillEvidenceModal';
import { Code2, ExternalLink } from 'lucide-react';

export interface SkillProfileGridProps {
  skills: SkillItem[];
}

export const SkillProfileGrid: React.FC<SkillProfileGridProps> = ({ skills }) => {
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);

  const getSourceBadge = (source: SkillItem['source']) => {
    switch (source) {
      case 'GITHUB':
        return <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">GitHub Detected</span>;
      case 'SELF_DECLARED':
        return <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">Self Declared</span>;
      case 'COURSEWORK':
        return <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">Coursework</span>;
      default:
        return <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">AI Estimated</span>;
    }
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-brand-600" />
          <h3 className="text-base font-bold text-slate-900">Detected Skill Confidence Profile</h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">AI-estimated confidence scores</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <Card key={skill.id} hoverable className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-sm font-bold text-slate-900">{skill.name}</h4>
                {getSourceBadge(skill.source)}
              </div>

              <div className="space-y-1 text-xs mb-3">
                <div className="flex justify-between items-center font-medium">
                  <span className="text-slate-500 text-[11px]">AI Confidence Score</span>
                  <span className="font-bold text-slate-900">{skill.confidenceScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-500"
                    style={{ width: `${skill.confidenceScore}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Estimated: <strong>{skill.estimatedLevel}</strong></span>
                <span>{skill.evidenceCount} repo signals</span>
              </div>
            </div>

            {skill.source === 'GITHUB' && (
              <button
                type="button"
                onClick={() => setSelectedSkillName(skill.name)}
                className="text-[11px] font-semibold text-brand-600 hover:underline text-left pt-2 border-t border-slate-100 mt-3 inline-flex items-center gap-1"
              >
                <span>View GitHub Evidence</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </Card>
        ))}
      </div>

      {selectedSkillName && (
        <SkillEvidenceModal
          isOpen={!!selectedSkillName}
          onClose={() => setSelectedSkillName(null)}
          skillName={selectedSkillName}
        />
      )}
    </div>
  );
};
