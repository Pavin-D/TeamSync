import React from 'react';

export interface ParticipationTrendItem {
  year: number;
  students: number;
  events: number;
  teams: number;
}

export interface CollegeParticipationChartProps {
  data: ParticipationTrendItem[];
}

export const CollegeParticipationChart: React.FC<CollegeParticipationChartProps> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => Math.max(d.students, d.events * 5, d.teams * 5)), 1);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle text-left space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Student & Event Participation Trend
        </h3>
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600 inline-block" /> Participating Students
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Events
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-end pt-6 border-b border-slate-100 min-h-[160px]">
        {data.map((d) => {
          const studentsHeight = Math.round((d.students / maxVal) * 100);
          const eventsHeight = Math.round(((d.events * 5) / maxVal) * 100);

          return (
            <div key={d.year} className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-2 h-28 w-full justify-center">
                <div
                  className="w-4 bg-brand-600 rounded-t-md transition-all duration-500"
                  style={{ height: `${studentsHeight}%` }}
                  title={`${d.year}: ${d.students} Students`}
                />
                <div
                  className="w-4 bg-indigo-500 rounded-t-md transition-all duration-500"
                  style={{ height: `${eventsHeight}%` }}
                  title={`${d.year}: ${d.events} Events`}
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
