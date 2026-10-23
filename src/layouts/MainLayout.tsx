import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLES, ROLE_CONFIGS } from '@/constants/roles';
import { realtimeService } from '@/services/api/realtimeService';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { GlobalSearchModal } from '@/components/global/GlobalSearchModal';
import { Avatar } from '@/components/ui/Cards';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Globe,
  Sparkles,
  Users,
  Trophy,
  MapPin,
  UserCheck,
  Award,
  Search,
  LogOut,
  Menu,
  X,
  User,
  Shield,
  Crown,
  ChevronRight
} from 'lucide-react';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, role, logout } = useAuth();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      realtimeService.connect();
    } else {
      realtimeService.disconnect();
    }

    return () => {
      realtimeService.disconnect();
    };
  }, [isAuthenticated]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSidebarNavItems = () => {
    if (role === ROLES.STUDENT) {
      return [
        { label: 'Dashboard Overview', path: '/student/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'My Profile', path: '/student/profile', icon: <User className="w-4 h-4 text-purple-400" /> },
        { label: 'My College', path: '/student/dashboard?tab=college', icon: <Building2 className="w-4 h-4 text-brand-600" /> },
        { label: 'My Department', path: '/student/dashboard?tab=department', icon: <GraduationCap className="w-4 h-4 text-indigo-600" /> },
        { label: 'Global Hackathons', path: '/student/dashboard?tab=global', icon: <Globe className="w-4 h-4 text-emerald-600" /> },
        { label: 'AI Teammate Match', path: '/recommendations', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
        { label: 'College Staff Mentors', path: '/student/college-mentors', icon: <UserCheck className="w-4 h-4 text-cyan-400" /> },
        { label: 'Nearby Students', path: '/nearby', icon: <MapPin className="w-4 h-4" /> },
        { label: 'Work Professionals', path: '/mentors', icon: <UserCheck className="w-4 h-4 text-cyan-400" /> },
        { label: 'Rankings', path: '/rankings/students', icon: <Award className="w-4 h-4" /> },
      ];
    } else if (role === ROLES.PROFESSIONAL) {
      return [
        { label: 'Professional Dashboard', path: '/professional/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'My Teams', path: '/professional/dashboard?tab=my-teams', icon: <Crown className="w-4 h-4 text-amber-400" /> },
        { label: 'My Company', path: '/professional/dashboard?tab=company', icon: <Building2 className="w-4 h-4 text-cyan-400" /> },
        { label: 'Global Hackathons', path: '/professional/dashboard?tab=global', icon: <Globe className="w-4 h-4 text-emerald-400" /> },
        { label: 'Recruiting Teams', path: '/professional/dashboard?tab=teams', icon: <Users className="w-4 h-4 text-indigo-400" /> },
        { label: 'Mentorship Hub', path: '/mentor/dashboard', icon: <UserCheck className="w-4 h-4 text-amber-400" /> },
        { label: 'Nearby Discovery', path: '/nearby', icon: <MapPin className="w-4 h-4 text-purple-400" /> },
      ];
    } else if ((role as string) === ROLES.COLLEGE || (role as string) === 'COLLEGE_ADMIN' || (role as string) === 'COLLEGE') {
      return [
        { label: 'College Dashboard', path: '/college/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'College Staff', path: '/college/staff', icon: <UserCheck className="w-4 h-4 text-cyan-400" /> },
        { label: 'College Events & Hackathons', path: '/college/events', icon: <Trophy className="w-4 h-4 text-amber-400" /> },
        { label: 'College Students', path: '/college/students', icon: <Users className="w-4 h-4" /> },
        { label: 'Departments', path: '/college/departments', icon: <Building2 className="w-4 h-4 text-purple-400" /> },
        { label: 'Staff Mentorship', path: '/college/mentorship', icon: <Award className="w-4 h-4 text-indigo-400" /> },
        { label: 'Rankings', path: '/college/ranking', icon: <Award className="w-4 h-4" /> },
        { label: 'Analytics & Reports', path: '/college/analytics', icon: <Globe className="w-4 h-4" /> },
        { label: 'College Profile', path: '/college/profile', icon: <Building2 className="w-4 h-4" /> },
      ];
    } else if ((role as string) === ROLES.ADMIN || (role as string) === 'ADMIN' || (role as string) === 'PLATFORM_ADMIN') {
      return [
        { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'User Management', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
        { label: 'Institutions', path: '/admin/institutions', icon: <Building2 className="w-4 h-4" /> },
        { label: 'Teams', path: '/admin/teams', icon: <Users className="w-4 h-4" /> },
        { label: 'Events', path: '/admin/events', icon: <Trophy className="w-4 h-4" /> },
        { label: 'Reports & Safety', path: '/admin/reports', icon: <Shield className="w-4 h-4" /> },
        { label: 'Platform Analytics', path: '/admin/analytics', icon: <Globe className="w-4 h-4" /> },
      ];
    }
    return [];
  };

  const isLinkActive = (path: string) => {
    const currentFull = location.pathname + location.search;
    if (path.includes('?tab=')) {
      return currentFull === path;
    }
    return location.pathname === path && !location.search.includes('tab=');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white antialiased">
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    );
  }

  const roleConfig = role ? ROLE_CONFIGS[role] : null;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white antialiased">
      {/* 1. Left Sidebar Navigation (Desktop Fixed & Mobile Slide-over) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-subtle">
                S
              </div>
              <div>
                <span className="font-extrabold text-white text-sm block tracking-tight">TeamSync AI</span>
                <span className="text-[10px] font-medium text-slate-400 block">Smart Team Formation</span>
              </div>
            </NavLink>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Badge */}
          {roleConfig && (
            <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-950/40 flex items-center justify-between text-left">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Navigation</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${roleConfig.badgeColor}`}>
                {roleConfig.label}
              </span>
            </div>
          )}

          {/* Sidebar Links */}
          <nav className="p-3 space-y-1 text-left">
            {getSidebarNavItems().map((item) => {
              const active = isLinkActive(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-brand-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-left">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div
              onClick={() => navigate(role === ROLES.COLLEGE ? '/college/profile' : role === ROLES.ADMIN ? '/admin/profile' : '/student/profile')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80 transition"
            >
              <Avatar name={user?.name || 'User'} src={user?.avatarUrl} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate hover:underline">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-rose-500/30"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay Backdrop for Mobile */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* 2. Main Layout Container */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Top Header Controls Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-slate-900 text-sm hidden sm:inline-block">
              TeamSync Workspace
            </span>
          </div>

          {/* Top Bar Utilities */}
          <div className="flex items-center gap-3">
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

            <NotificationCenter />

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              PostgreSQL Connected
            </div>
          </div>
        </header>

        {/* Main Workspace Page View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 AI Smart Team Formation System. All rights reserved.</span>
            <div className="flex items-center gap-4 text-slate-500 font-medium">
              <a href="/guidelines" className="hover:underline">Community Guidelines</a>
              <a href="#" className="hover:underline">Support</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Command Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

