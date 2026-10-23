import React from 'react';
import { Card } from '@/components/ui/Cards';
import { Code } from 'lucide-react';

export interface LanguageDistributionProps {
  languages: { name: string; percentage: number; color?: string }[];
}

export const LanguageDistributionChart: React.FC<LanguageDistributionProps> = ({ languages }) => {
  const defaultColors = ['bg-amber-500', 'bg-brand-600', 'bg-violet-600', 'bg-emerald-600', 'bg-rose-500'];

  return (
    <Card className="p-5 text-left flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Programming Languages</h3>
        </div>

        {/* Multi-segment distribution bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex mb-4">
          {languages.map((lang, idx) => (
            <div
              key={lang.name}
              className={`h-full ${lang.color || defaultColors[idx % defaultColors.length]}`}
              style={{ width: `${lang.percentage}%` }}
              title={`${lang.name}: ${lang.percentage}%`}
            />
          ))}
        </div>

        <div className="space-y-2 text-xs">
          {languages.map((lang, idx) => (
            <div key={lang.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${lang.color || defaultColors[idx % defaultColors.length]}`} />
                <span className="font-semibold text-slate-800">{lang.name}</span>
              </div>
              <span className="font-bold text-slate-900">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
