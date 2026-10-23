import React from 'react';
import { MentorFilterParams } from '@/services/api/mentorService';
import { Select, TextInput } from '@/components/ui/Inputs';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

export interface MentorFiltersProps {
  filters: MentorFilterParams;
  onChange: (key: keyof MentorFilterParams, value: any) => void;
  onReset: () => void;
}

export const MentorFilters: React.FC<MentorFiltersProps> = ({ filters, onChange, onReset }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900">Filter Mentor Network</h3>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select
          label="Mentoring Area / Expertise"
          value={filters.expertise || ''}
          onChange={(e) => onChange('expertise', e.target.value || undefined)}
          options={[
            { value: '', label: 'All Expertise Areas' },
            { value: 'Technical Development', label: 'Technical Development' },
            { value: 'AI / Machine Learning', label: 'AI / Machine Learning' },
            { value: 'System Design & Architecture', label: 'System Design & Architecture' },
            { value: 'Cloud & DevOps', label: 'Cloud & DevOps' },
            { value: 'Hackathon Strategy', label: 'Hackathon Strategy' },
            { value: 'Career Guidance', label: 'Career Guidance' },
          ]}
        />

        <Select
          label="Years of Experience"
          value={filters.experienceYears || ''}
          onChange={(e) => onChange('experienceYears', e.target.value || undefined)}
          options={[
            { value: '', label: 'Any Experience' },
            { value: '1-3', label: '1 - 3 years' },
            { value: '3-5', label: '3 - 5 years' },
            { value: '5-10', label: '5 - 10 years' },
            { value: '10+', label: '10+ years' },
          ]}
        />

        <Select
          label="Availability Schedule"
          value={filters.availability || ''}
          onChange={(e) => onChange('availability', e.target.value || undefined)}
          options={[
            { value: '', label: 'Any Availability' },
            { value: 'Weekdays', label: 'Weekdays' },
            { value: 'Weekends', label: 'Weekends' },
            { value: 'Evenings', label: 'Evenings' },
            { value: 'Flexible', label: 'Flexible Schedule' },
          ]}
        />

        <TextInput
          label="Search by Name or Tech Skill"
          value={filters.search || ''}
          onChange={(e) => onChange('search', e.target.value || undefined)}
          placeholder="e.g. Node.js, AWS, PyTorch..."
        />
      </div>
    </div>
  );
};
