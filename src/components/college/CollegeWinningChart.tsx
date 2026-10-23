import React from 'react';

export interface WinningTrendItem {
  year: number;
  wins: number;
  finalists: number;
}

export interface CollegeWinningChartProps {
  data: WinningTrendItem[];
}

export const CollegeWinningChart: React.FC<CollegeWinningChartProps> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => Math.max(d.wins, d.finalists)), 1);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle text-left space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Winning & Finalist Progression
        </h3>
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Wins
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Finalists
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-end pt-6 border-b border-slate-100 min-h-[160px]">
        {data.map((d) => {
          const winsHeight = Math.round((d.wins / maxVal) * 100);
          const finalistsHeight = Math.round((d.finalists / maxVal) * 100);

          return (
            <div key={d.year} className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-2 h-28 w-full justify-center">
                <div
                  className="w-4 bg-amber-500 rounded-t-md transition-all duration-500"
                  style={{ height: `${winsHeight}%` }}
                  title={`${d.year}: ${d.wins} Wins`}
                />
                <div
                  className="w-4 bg-sky-500 rounded-t-md transition-all duration-500"
                  style={{ height: `${finalistsHeight}%` }}
                  title={`${d.year}: ${d.finalists} Finalists`}
                />
              </div>
              <span className="text-xs font-bold text-slate-700">{d.year}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
