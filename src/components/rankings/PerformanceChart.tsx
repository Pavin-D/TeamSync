import React from 'react';
import { YearlyPerformanceTrend } from '@/services/api/rankingService';

export interface PerformanceChartProps {
  data: YearlyPerformanceTrend[];
  title?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  title = 'Participation & Performance Trend',
}) => {
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.events || d.participations || 0, d.wins || 0, d.finalists || 0)),
    1
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h3>
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600 inline-block" /> Events
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Wins
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Finalists
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-end pt-6 border-b border-slate-100 min-h-[160px]">
        {data.map((d, idx) => {
          const eventsCount = d.events || d.participations || 0;
          const winsCount = d.wins || 0;
          const finalistsCount = d.finalists || 0;

          const eventsHeight = Math.round((eventsCount / maxVal) * 100);
          const winsHeight = Math.round((winsCount / maxVal) * 100);
          const finalistsHeight = Math.round((finalistsCount / maxVal) * 100);

          return (
            <div key={d.year || d.period || idx} className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-1.5 h-28 w-full justify-center">
                <div
                  className="w-3.5 bg-brand-600 rounded-t-md transition-all duration-500"
                  style={{ height: `${eventsHeight}%` }}
                  title={`${d.year || d.period}: ${eventsCount} Events`}
                />
                <div
                  className="w-3.5 bg-amber-500 rounded-t-md transition-all duration-500"
                  style={{ height: `${winsHeight}%` }}
                  title={`${d.year || d.period}: ${winsCount} Wins`}
                />
                <div
                  className="w-3.5 bg-indigo-500 rounded-t-md transition-all duration-500"
                  style={{ height: `${finalistsHeight}%` }}
                  title={`${d.year || d.period}: ${finalistsCount} Finalists`}
                />
              </div>
              <span className="text-xs font-bold text-slate-700">{d.year || d.period}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
