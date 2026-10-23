import React from 'react';
import { Card } from '@/components/ui/Cards';
import { Layers } from 'lucide-react';

export interface TechDistributionProps {
  categories: { category: string; percentage: number }[];
}

export const TechDistributionChart: React.FC<TechDistributionProps> = ({ categories }) => {
  return (
    <Card className="p-5 text-left flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-5 h-5 text-accent-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technology Distribution</h3>
        </div>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.category} className="space-y-1 text-xs">
              <div className="flex justify-between items-center font-semibold text-slate-800">
                <span>{cat.category}</span>
                <span>{cat.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-600 rounded-full transition-all duration-500"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
