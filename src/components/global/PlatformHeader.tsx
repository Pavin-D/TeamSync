import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/constants/roles';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { GlobalSearchModal } from '@/components/global/GlobalSearchModal';
import { Avatar } from '@/components/ui/Cards';
import { Search, LogOut, User, Settings, CheckSquare } from 'lucide-react';

export const PlatformHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const getNavLinks = () => {
    switch (role) {
      case ROLES.STUDENT:
        return [
          { label: 'Dashboard', path: '/student/dashboard' },
          { label: 'My Workspace', path: '/student/teams' },
          { label: 'Events', path: '/events' },
          { label: 'Teams', path: '/teams' },
          { label: 'AI Match', path: '/recommendations' },
          { label: 'Nearby', path: '/nearby' },
          { label: 'Mentors', path: '/mentors' },
          { label: 'Rankings', path: '/rankings/students' },
        ];
      case ROLES.PROFESSIONAL:
        return [
          { label: 'Dashboard', path: '/professional/dashboard' },
          { label: 'My Workspace', path: '/professional/teams' },
          { label: 'Events', path: '/events' },
          { label: 'Teams', path: '/teams' },
          { label: 'Nearby', path: '/nearby' },
          { label: 'Mentorship', path: '/mentor/dashboard' },
        ];
      case ROLES.COLLEGE:
        return [
          { label: 'Dashboard', path: '/college/dashboard' },
          { label: 'Students', path: '/college/students' },
          { label: 'Departments', path: '/college/departments' },
          { label: 'Events', path: '/college/events' },
          { label: 'Teams', path: '/college/teams' },
          { label: 'Rankings', path: '/college/ranking' },
          { label: 'Analytics', path: '/college/analytics' },
        ];
      case ROLES.ADMIN:
        return [
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Users', path: '/admin/users' },
          { label: 'Colleges', path: '/admin/institutions' },
          { label: 'Teams', path: '/admin/teams' },
          { label: 'Events', path: '/admin/events' },
          { label: 'Reports', path: '/admin/reports' },
          { label: 'Analytics', path: '/admin/analytics' },
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-subtle">
                S
              </div>
              <span className="font-extrabold text-slate-900 text-sm hidden sm:inline-block">
                Smart Team Formation
              </span>
            </NavLink>

            {/* Main Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {getNavLinks().map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Command Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-xs font-medium transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono font-bold text-slate-400 bg-white px-1.5 rounded shadow-xs">
                Ctrl+K
              </kbd>
            </button>

            {/* Notification Bell */}
            <NotificationCenter />

            {/* Real-time Status Dot */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </div>

            {/* User Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition"
              >
                <Avatar name={user?.name || 'User'} src={user?.avatarUrl} size="sm" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-11 w-56 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 z-50 text-left space-y-1">
                  <div className="p-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-xs block">{user?.name || 'Authenticated User'}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">{user?.email}</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/student/teams');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4 text-brand-600" /> My Team Workspace
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/student/profile');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" /> My Profile
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/settings/notifications');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-slate-400" /> Notification Settings
                  </button>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
