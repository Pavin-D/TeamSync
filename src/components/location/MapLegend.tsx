import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-subtle">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-brand-600 inline-block border border-white shadow-subtle" />
        <span>Student</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-violet-600 inline-block border border-white shadow-subtle" />
        <span>Professional</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-white shadow-subtle" />
        <span>Recruiting Team</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-sky-500 inline-block border border-white shadow-subtle" />
        <span>Your Approximate Area</span>
      </div>
    </div>
  );
};
