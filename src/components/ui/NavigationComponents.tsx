import React from 'react';
import { cn } from '@/utils/cn';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { BreadcrumbItem } from '@/types/navigation';
import { Link } from 'react-router-dom';

// --- Breadcrumb ---
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={cn('flex items-center text-xs font-medium text-slate-500', className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              {isLast || !item.path ? (
                <span className="text-slate-900 font-semibold">{item.label}</span>
              ) : (
                <Link to={item.path} className="hover:text-brand-600 transition">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// --- Tabs ---
export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('border-b border-slate-200 flex gap-6 overflow-x-auto scrollbar-none', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'pb-3 text-sm font-medium transition-all relative flex items-center gap-2 whitespace-nowrap',
              isActive ? 'text-brand-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[11px] px-2 py-0.5 rounded-full font-semibold',
                  isActive ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-600'
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />}
          </button>
        );
      })}
    </div>
  );
};

// --- Pagination ---
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500', className)}>
      <span>
        Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
