import React, { useState } from 'react';
import { TextInput } from '@/components/ui/Inputs';
import { Search } from 'lucide-react';

export interface AdminGlobalSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const AdminGlobalSearch: React.FC<AdminGlobalSearchProps> = ({
  onSearch,
  placeholder = 'Search students, professionals, institutions, teams, events...',
}) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <TextInput
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9 bg-slate-50 border-slate-200 focus:bg-white text-xs"
      />
    </div>
  );
};
