import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium py-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            {item.path && !isLast ? (
              <Link to={item.path} className="hover:text-brand-600 transition">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-bold text-slate-900' : ''}>{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
