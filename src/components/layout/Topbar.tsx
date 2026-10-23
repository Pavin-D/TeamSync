import React from 'react';
import { Menu, Bell, User as UserIcon, Settings, LogOut } from 'lucide-react';
import { Avatar } from '@/components/ui/Cards';
import { Dropdown } from '@/components/ui/OverlayComponents';
import { SearchInput } from '@/components/ui/Inputs';
import { ALL_ROLES, ROLE_CONFIGS, UserRole, ROLES } from '@/constants/roles';
import { User } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

export interface TopbarProps {
  user: User | null;
  currentRole: UserRole;
  onToggleSidebar: () => void;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  title?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  user,
  currentRole,
  onToggleSidebar,
  onSwitchRole,
  onLogout,
  title = 'Dashboard',
}) => {
  const navigate = useNavigate();
  const roleConfig = ROLE_CONFIGS[currentRole];

  const profileMenuItems = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: <UserIcon className="w-4 h-4 text-slate-500" />,
      onClick: () => {
        if (currentRole === ROLES.COLLEGE) navigate('/college/profile');
        else if (currentRole === ROLES.ADMIN) navigate('/admin/profile');
        else navigate('/student/profile');
      },
    },
    {
      id: 'settings',
      label: 'Account Settings',
      icon: <Settings className="w-4 h-4 text-slate-500" />,
      onClick: () => navigate('/settings'),
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
      onClick: onLogout,
    },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20 shadow-subtle">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition focus-ring"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-base font-semibold text-slate-900 hidden sm:block">{title}</h2>
      </div>

      {/* Middle Search */}
      <div className="hidden md:block w-72 lg:w-96">
        <SearchInput placeholder="Search skills, teams, events..." />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Module 1 Testing Role Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[10px] font-semibold uppercase text-slate-500 px-1.5 hidden lg:inline">Test Role:</span>
          <select
            value={currentRole}
            onChange={(e) => onSwitchRole(e.target.value as UserRole)}
            className="bg-white text-xs font-semibold text-slate-800 rounded-lg px-2 py-1 border border-slate-200 focus:outline-none cursor-pointer"
          >
            {ALL_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_CONFIGS[r].label}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition relative focus-ring"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Dropdown */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-2.5 cursor-pointer p-1 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
              <Avatar name={user?.name || 'User'} src={user?.avatarUrl} size="sm" />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 leading-none">{user?.name || 'Alex Morgan'}</p>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">{roleConfig?.label}</p>
              </div>
            </div>
          }
          items={profileMenuItems}
          align="right"
        />
      </div>
    </header>
  );
};
