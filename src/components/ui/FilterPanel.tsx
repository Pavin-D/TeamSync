import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Select, TextInput, MultiSelect } from './Inputs';

export interface FilterOption {
  label: string;
  name: string;
  type: 'select' | 'text' | 'multiselect';
  options?: { label: string; value: string }[];
}

export interface FilterPanelProps {
  filtersConfig: FilterOption[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filtersConfig,
  values,
  onChange,
  onReset,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn('bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle mb-6 text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-semibold text-slate-900">Filter Discovery</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition sm:hidden"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className={cn('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4', !isExpanded && 'hidden sm:grid')}>
        {filtersConfig.map((filter) => {
          if (filter.type === 'select' && filter.options) {
            return (
              <Select
                key={filter.name}
                label={filter.label}
                options={filter.options}
                value={values[filter.name] || ''}
                onChange={(e) => onChange(filter.name, e.target.value)}
              />
            );
          }

          if (filter.type === 'multiselect' && filter.options) {
            return (
              <MultiSelect
                key={filter.name}
                label={filter.label}
                options={filter.options}
                value={values[filter.name] || []}
                onChange={(val) => onChange(filter.name, val)}
              />
            );
          }

          return (
            <TextInput
              key={filter.name}
              label={filter.label}
              value={values[filter.name] || ''}
              onChange={(e) => onChange(filter.name, e.target.value)}
              placeholder={`Filter by ${filter.label.toLowerCase()}...`}
            />
          );
        })}
      </div>
    </div>
  );
};
