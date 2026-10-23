import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { UserRole, ROLE_CONFIGS } from '@/constants/roles';
import {
  LayoutDashboard,
  User,
  Calendar,
  Building2,
  Building,
  Globe,
  Users,
  MapPin,
  Sparkles,
  Award,
  Shield,
  Send,
  MailCheck,
  TrendingUp,
  History,
  Bell,
  Settings,
  LogOut,
  Layers,
  UserCheck,
  PlusCircle,
} from 'lucide-react';
import { NavItem } from '@/types/navigation';

export interface SidebarProps {
  currentRole: UserRole;
  isCollapsed?: boolean;
  onLogout: () => void;
  className?: string;
}

export const getNavItemsForRole = (role: UserRole): NavItem[] => {
  if (role === 'STUDENT') {
    return [
      { id: 's_dashboard', label: 'Dashboard', path: '/student/dashboard', iconName: 'LayoutDashboard' },
      { id: 's_profile', label: 'My Profile', path: '/student/profile', iconName: 'User' },
      { id: 's_events', label: 'Events & Hackathons', path: '/student/events', iconName: 'Calendar' },
      { id: 's_college', label: 'My College', path: '/student/college', iconName: 'Building2' },
      { id: 's_department', label: 'My Department', path: '/student/department', iconName: 'Building' },
      { id: 's_all_colleges', label: 'All Colleges', path: '/student/all-colleges', iconName: 'Globe' },
      { id: 's_teammates', label: 'Find Teammates', path: '/student/teammates', iconName: 'Users' },
      { id: 's_nearby', label: 'Nearby People', path: '/student/nearby', iconName: 'MapPin' },
      { id: 's_recommendations', label: 'AI Recommendations', path: '/student/recommendations', iconName: 'Sparkles' },
      { id: 's_mentors', label: 'Professionals & Mentors', path: '/student/mentors', iconName: 'Award' },
      { id: 's_teams', label: 'My Teams', path: '/student/teams', iconName: 'Users' },
      { id: 's_team_lead', label: 'Team Lead', path: '/student/team-lead', iconName: 'Shield' },
      { id: 's_requests', label: 'Join Requests', path: '/student/requests', iconName: 'Send' },
      { id: 's_invitations', label: 'Invitations', path: '/student/invitations', iconName: 'MailCheck' },
      { id: 's_rankings', label: 'Rankings', path: '/student/rankings', iconName: 'TrendingUp' },
      { id: 's_participation', label: 'Participation History', path: '/student/participation', iconName: 'History' },
      { id: 's_showcase', label: 'Design System Library', path: '/showcase', iconName: 'Layers' },
    ];
  }

  if (role === 'COLLEGE_ADMIN' || role === 'COLLEGE') {
    return [
      { id: 'c_dashboard', label: 'Dashboard', path: '/college/dashboard', iconName: 'LayoutDashboard' },
      { id: 'c_staff', label: 'College Staff', path: '/college/staff', iconName: 'UserCheck' },
      { id: 'c_events', label: 'Events & Hackathons', path: '/college/events', iconName: 'Calendar' },
      { id: 'c_students', label: 'Students Directory', path: '/college/students', iconName: 'User' },
      { id: 'c_departments', label: 'Departments', path: '/college/departments', iconName: 'Building' },
      { id: 'c_teams', label: 'College Teams', path: '/college/teams', iconName: 'Users' },
      { id: 'c_mentorship', label: 'Staff Mentorship', path: '/college/mentorship', iconName: 'Award' },
      { id: 'c_analytics', label: 'Analytics & Reports', path: '/college/analytics', iconName: 'TrendingUp' },
      { id: 'c_profile', label: 'College Profile', path: '/college/profile', iconName: 'Building2' },
    ];
  }

  // Base fallback for other roles
  const baseItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: ROLE_CONFIGS[role]?.defaultPath || '/student/dashboard', iconName: 'LayoutDashboard' },
    { id: 'events', label: 'Events & Hackathons', path: '/events', iconName: 'Calendar' },
    { id: 'teams', label: 'Teams Workspace', path: '/teams', iconName: 'Users' },
    { id: 'people', label: 'Discover People', path: '/people', iconName: 'UserCheck' },
    { id: 'mentors', label: 'Mentors Network', path: '/mentors', iconName: 'Award' },
    { id: 'rankings', label: 'Leaderboards & Rankings', path: '/rankings', iconName: 'TrendingUp' },
    { id: 'showcase', label: 'Design System Library', path: '/showcase', iconName: 'Layers' },
  ];

  return baseItems;
};

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  Building: <Building className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4 text-brand-600" />,
  Award: <Award className="w-4 h-4 text-violet-600" />,
  Shield: <Shield className="w-4 h-4" />,
  Send: <Send className="w-4 h-4" />,
  MailCheck: <MailCheck className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  History: <History className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  PlusCircle: <PlusCircle className="w-4 h-4 text-emerald-600" />,
  Layers: <Layers className="w-4 h-4 text-accent-500" />,
};

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, isCollapsed = false, onLogout, className }) => {
  const navItems = getNavItemsForRole(currentRole);
  const roleConfig = ROLE_CONFIGS[currentRole];

  return (
    <aside
      className={cn(
        'bg-white border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 h-screen sticky top-0 z-30 select-none overflow-hidden',
        isCollapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">TeamForge AI</h1>
              <span className="text-[10px] text-slate-400 font-medium">Smart Team Formation</span>
            </div>
          )}
        </div>

        {/* Role Badge Indicator */}
        {!isCollapsed && (
          <div className="px-4 py-2.5 mx-3 mt-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Active Role</span>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">{roleConfig?.label}</span>
              <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded border', roleConfig?.badgeColor)}>
                {currentRole}
              </span>
            </div>
          </div>
        )}

        {/* Navigation List - Scrollable */}
        <nav className="p-3 space-y-0.5 mt-2 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition duration-200',
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-100/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              <span className="shrink-0">{iconMap[item.iconName]}</span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-100 space-y-0.5 shrink-0 bg-white">
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition',
              isActive && 'text-brand-600 font-semibold'
            )
          }
        >
          <Bell className="w-4 h-4" />
          {!isCollapsed && <span>Notifications</span>}
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition',
              isActive && 'text-brand-600 font-semibold'
            )
          }
        >
          <Settings className="w-4 h-4" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition text-left"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
