import React from 'react';

export interface RadiusFilterControlProps {
  radiusKm: number;
  onChangeRadius: (radiusKm: number) => void;
}

export const RadiusFilterControl: React.FC<RadiusFilterControlProps> = ({
  radiusKm,
  onChangeRadius,
}) => {
  const radii = [1, 5, 10, 20, 50, 100];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">Radius:</span>
      {radii.map((r) => {
        const isSelected = radiusKm === r;
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChangeRadius(r)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 ${
              isSelected
                ? 'bg-slate-900 text-white shadow-subtle'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
            }`}
          >
            {r} km
          </button>
        );
      })}
    </div>
  );
};
