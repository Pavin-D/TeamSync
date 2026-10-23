import React, { useState } from 'react';
import { Select, TextInput } from '@/components/ui/Inputs';
import { SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { EventFilterParams } from '@/services/api/eventService';

export interface EventFiltersProps {
  filters: EventFilterParams;
  onChange: (key: keyof EventFilterParams, value: any) => void;
  onReset: () => void;
  className?: string;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
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
          <h3 className="text-sm font-bold text-slate-900">Filter Events & Hackathons</h3>
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
        {/* Status */}
        <Select
          label="Status"
          value={filters.status || ''}
          onChange={(e) => onChange('status', e.target.value || undefined)}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'REGISTRATION_OPEN', label: 'Registration Open' },
            { value: 'CLOSING_SOON', label: 'Registration Closing Soon' },
            { value: 'UPCOMING', label: 'Upcoming' },
            { value: 'ONGOING', label: 'Ongoing' },
            { value: 'COMPLETED', label: 'Completed' },
          ]}
        />

        {/* Scope */}
        <Select
          label="Event Scope"
          value={filters.scope || ''}
          onChange={(e) => onChange('scope', e.target.value || undefined)}
          options={[
            { value: '', label: 'All Scopes' },
            { value: 'COLLEGE', label: 'College Level' },
            { value: 'DEPARTMENT', label: 'Department Level' },
            { value: 'INTER_COLLEGE', label: 'Inter-College' },
            { value: 'NATIONAL', label: 'National' },
            { value: 'GLOBAL', label: 'Global' },
          ]}
        />

        {/* Mode */}
        <Select
          label="Event Mode"
          value={filters.mode || ''}
          onChange={(e) => onChange('mode', e.target.value || undefined)}
          options={[
            { value: '', label: 'All Modes' },
            { value: 'ONLINE', label: 'Online / Virtual' },
            { value: 'OFFLINE', label: 'Offline / In-Person' },
            { value: 'HYBRID', label: 'Hybrid' },
          ]}
        />

        {/* Domain */}
        <Select
          label="Problem Domain"
          value={filters.domain || ''}
          onChange={(e) => onChange('domain', e.target.value || undefined)}
          options={[
            { value: '', label: 'All Domains' },
            { value: 'AI / ML', label: 'AI / Machine Learning' },
            { value: 'Web Development', label: 'Web Development' },
            { value: 'Mobile Development', label: 'Mobile Development' },
            { value: 'Cybersecurity', label: 'Cybersecurity' },
            { value: 'Cloud Architecture', label: 'Cloud' },
            { value: 'Blockchain', label: 'Blockchain & Web3' },
            { value: 'Open Innovation', label: 'Open Innovation' },
          ]}
        />

        {/* Team Size */}
        <Select
          label="Team Size"
          value={filters.teamSize || ''}
          onChange={(e) => onChange('teamSize', e.target.value || undefined)}
          options={[
            { value: '', label: 'Any Team Size' },
            { value: '1', label: 'Individual' },
            { value: '2-3', label: '2 – 3 Members' },
            { value: '2-5', label: '2 – 5 Members' },
            { value: '4-6', label: '4 – 6 Members' },
          ]}
        />

        {/* Eligibility */}
        <Select
          label="Eligibility"
          value={filters.eligibility || ''}
          onChange={(e) => onChange('eligibility', e.target.value || undefined)}
          options={[
            { value: '', label: 'All Eligible Groups' },
            { value: 'STUDENTS', label: 'Students Only' },
            { value: 'PROFESSIONALS', label: 'Professionals Only' },
            { value: 'STUDENTS_AND_PROFESSIONALS', label: 'Students + Professionals' },
          ]}
        />

        {/* Location City */}
        <TextInput
          label="City / Location"
          value={filters.city || ''}
          onChange={(e) => onChange('city', e.target.value || undefined)}
          placeholder="e.g. San Francisco, Boston"
        />
      </div>
    </div>
  );
};
