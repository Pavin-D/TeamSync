import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { LayoutDashboard, Users, Calendar, MoreHorizontal, Layers } from 'lucide-react';
import { ROLE_CONFIGS, UserRole } from '@/constants/roles';

export interface MobileNavProps {
  currentRole: UserRole;
  onOpenMore: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentRole, onOpenMore }) => {
  const defaultPath = ROLE_CONFIGS[currentRole]?.defaultPath || '/student/dashboard';

  const navItems = [
    { label: 'Home', path: defaultPath, icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Teams', path: '/teams', icon: <Users className="w-5 h-5" /> },
    { label: 'Events', path: '/events', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Showcase', path: '/showcase', icon: <Layers className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-2 flex items-center justify-around shadow-lg">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 text-[11px] font-medium py-1 px-3 rounded-xl transition',
              isActive ? 'text-brand-600 font-semibold bg-brand-50' : 'text-slate-500 hover:text-slate-800'
            )
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}

      <button
        onClick={onOpenMore}
        className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-slate-500 hover:text-slate-800 py-1 px-3 rounded-xl transition"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span>More</span>
      </button>
    </nav>
  );
};
