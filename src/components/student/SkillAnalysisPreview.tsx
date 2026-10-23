import React from 'react';
import { Card } from '@/components/ui/Cards';
import { SkillItem } from '@/services/api/studentService';
import { Code2, Github, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface SkillAnalysisPreviewProps {
  skills?: SkillItem[];
  githubConnected?: boolean;
}

export const SkillAnalysisPreview: React.FC<SkillAnalysisPreviewProps> = ({
  skills = [
    { name: 'React', levelPercentage: 90, source: 'GitHub Activity' },
    { name: 'JavaScript', levelPercentage: 82, source: 'GitHub Activity' },
    { name: 'Node.js', levelPercentage: 75, source: 'GitHub Activity' },
    { name: 'PostgreSQL', levelPercentage: 65, source: 'Coursework' },
    { name: 'Python', levelPercentage: 52, source: 'GitHub Activity' },
  ],
  githubConnected = true,
}) => {
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">Your Skill Analysis</h3>
          </div>
          {githubConnected ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              <Github className="w-3 h-3 text-slate-700" /> Detected from GitHub
            </span>
          ) : (
            <span className="text-[11px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
              GitHub Disconnected
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Automated breakdown of your technical proficiency and domain expertise.
        </p>

        <div className="space-y-3 mb-4">
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-1 text-xs">
              <div className="flex justify-between items-center font-medium">
                <span className="text-slate-800 font-semibold">{skill.name}</span>
                <span className="text-slate-500 font-bold">{skill.levelPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-500"
                  style={{ width: `${skill.levelPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/student/profile"
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition pt-2 border-t border-slate-100"
      >
        <span>View Full Skill Analysis</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </Card>
  );
};
