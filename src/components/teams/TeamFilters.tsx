import React, { useState } from 'react';
import { Select, TextInput } from '@/components/ui/Inputs';
import { SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { TeamFilterParams } from '@/services/api/teamService';

export interface TeamFiltersProps {
  filters: TeamFilterParams;
  onChange: (key: keyof TeamFilterParams, value: any) => void;
  onReset: () => void;
  className?: string;
}

export const TeamFilters: React.FC<TeamFiltersProps> = ({
  filters,
  onChange,
  onReset,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle mb-6 text-left ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900">Filter Recruiting Teams</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition sm:hidden"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 ${!isExpanded && 'hidden sm:grid'}`}>
        {/* Scope */}
        <Select
          label="Visibility Scope"
          value={filters.scope || ''}
          onChange={(e) => onChange('scope', e.target.value || undefined)}
          options={[
            { value: '', label: 'All Scopes' },
            { value: 'DEPARTMENT', label: 'My Department' },
            { value: 'COLLEGE', label: 'My College' },
            { value: 'ALL_COLLEGES', label: 'All Colleges' },
            { value: 'GLOBAL', label: 'Global Platform' },
          ]}
        />

        {/* Team Status */}
        <Select
          label="Recruitment Status"
          value={filters.status || ''}
          onChange={(e) => onChange('status', e.target.value || undefined)}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'RECRUITING', label: 'Actively Recruiting' },
            { value: 'PAUSED', label: 'Recruitment Paused' },
            { value: 'FULL', label: 'Team Full' },
            { value: 'CLOSED', label: 'Closed' },
          ]}
        />

        {/* Team Type */}
        <Select
          label="Team Type"
          value={filters.teamType || ''}
          onChange={(e) => onChange('teamType', e.target.value || undefined)}
          options={[
            { value: '', label: 'All Team Types' },
            { value: 'STUDENT', label: 'Students Only' },
            { value: 'PROFESSIONAL', label: 'Professionals Only' },
            { value: 'MIXED', label: 'Students + Professionals' },
          ]}
        />

        {/* Remaining Slots */}
        <Select
          label="Remaining Slots"
          value={filters.remainingSlots || ''}
          onChange={(e) => onChange('remainingSlots', e.target.value || undefined)}
          options={[
            { value: '', label: 'Any Slots' },
            { value: '1', label: '1 Slot Open' },
            { value: '2', label: '2 Slots Open' },
            { value: '3+', label: '3+ Slots Open' },
          ]}
        />

        {/* Skills Filter */}
        <TextInput
          label="Required Skill"
          value={filters.skills || ''}
          onChange={(e) => onChange('skills', e.target.value || undefined)}
          placeholder="e.g. React, PyTorch, Node.js"
        />

        {/* College Filter */}
        <TextInput
          label="College / Institution"
          value={filters.college || ''}
          onChange={(e) => onChange('college', e.target.value || undefined)}
          placeholder="e.g. Stanford University"
        />

        {/* Department Filter */}
        <TextInput
          label="Department"
          value={filters.department || ''}
          onChange={(e) => onChange('department', e.target.value || undefined)}
          placeholder="e.g. Computer Science"
        />
      </div>
    </div>
  );
};
