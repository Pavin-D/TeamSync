import React, { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { ROLE_CONFIGS, UserRole } from '@/constants/roles';
import { Users, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Button } from './Button';

// --- Card ---
export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, hoverable = false }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card transition-all duration-200 text-left',
        hoverable && 'hover:shadow-popover hover:border-brand-200 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

// --- StatCard ---
export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: ReactNode;
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  description,
  className,
}) => {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        {icon && (
          <div className="p-3 bg-brand-50 rounded-xl text-brand-600 border border-brand-100/80 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={cn(
                'font-semibold px-2 py-0.5 rounded-full',
                isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              )}
            >
              {change}
            </span>
          )}
          {description && <span className="text-slate-500">{description}</span>}
        </div>
      )}
    </Card>
  );
};

// --- Avatar ---
export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'U';
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover border border-slate-200 shrink-0', sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-white font-semibold flex items-center justify-center border border-white shadow-subtle shrink-0',
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};

// --- Badge ---
export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm', className }) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    outline: 'bg-transparent text-slate-600 border-slate-300',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={cn('inline-flex items-center font-medium rounded-md border', variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
};

// --- StatusBadge ---
export interface StatusBadgeProps {
  status: 'OPEN' | 'FULL' | 'CLOSED' | 'AVAILABLE' | 'BUSY';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    OPEN: { variant: 'success' as const, label: 'Open for Members' },
    AVAILABLE: { variant: 'success' as const, label: 'Available' },
    FULL: { variant: 'warning' as const, label: 'Team Full' },
    BUSY: { variant: 'warning' as const, label: 'In Team' },
    CLOSED: { variant: 'danger' as const, label: 'Closed' },
  };

  const config = statusConfig[status] || { variant: 'default' as const, label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// --- SkillBadge ---
export interface SkillBadgeProps {
  skill: string;
  onRemove?: () => void;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, onRemove }) => {
  return (
    <span className="inline-flex items-center gap-1 bg-accent-50 text-accent-700 border border-accent-200 rounded-lg text-xs px-2.5 py-1 font-medium">
      {skill}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-accent-900 ml-0.5">
          ×
        </button>
      )}
    </span>
  );
};

// --- UserCard ---
export interface UserCardProps {
  name: string;
  role: UserRole;
  institution?: string;
  department?: string;
  skills?: string[];
  avatarUrl?: string;
  availability?: 'AVAILABLE' | 'BUSY';
  onAction?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  name,
  role,
  institution,
  department,
  skills = [],
  avatarUrl,
  availability,
  onAction,
}) => {
  const roleConfig = ROLE_CONFIGS[role];

  return (
    <Card hoverable className="flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={name} src={avatarUrl} size="lg" />
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{name}</h4>
              <Badge className={roleConfig?.badgeColor}>{roleConfig?.label || role}</Badge>
            </div>
          </div>
          {availability && <StatusBadge status={availability} />}
        </div>

        {(institution || department) && (
          <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{[department, institution].filter(Boolean).join(' • ')}</span>
          </p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skills.slice(0, 4).map((s) => (
              <SkillBadge key={s} skill={s} />
            ))}
            {skills.length > 4 && (
              <span className="text-[11px] text-slate-400 self-center">+{skills.length - 4} more</span>
            )}
          </div>
        )}
      </div>

      {onAction && (
        <Button variant="outline" size="sm" fullWidth onClick={onAction} rightIcon={<ChevronRight className="w-4 h-4" />}>
          View Profile
        </Button>
      )}
    </Card>
  );
};

// --- TeamCard ---
export interface TeamCardProps {
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  skillsNeeded: string[];
  status: 'OPEN' | 'FULL' | 'CLOSED';
  onJoin?: () => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  name,
  description,
  memberCount,
  maxMembers,
  skillsNeeded,
  status,
  onJoin,
}) => {
  return (
    <Card hoverable className="flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-base font-semibold text-slate-900">{name}</h4>
          <StatusBadge status={status} />
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">{description}</p>

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg">
          <Users className="w-4 h-4 text-brand-600" />
          <span>
            <strong className="text-slate-900">{memberCount}</strong> / {maxMembers} Members
          </span>
        </div>

        {skillsNeeded.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1.5">Looking for:</span>
            <div className="flex flex-wrap gap-1.5">
              {skillsNeeded.map((s) => (
                <SkillBadge key={s} skill={s} />
              ))}
            </div>
          </div>
        )}
      </div>

      {onJoin && (
        <Button size="sm" fullWidth disabled={status !== 'OPEN'} onClick={onJoin}>
          Request to Join
        </Button>
      )}
    </Card>
  );
};

// --- EventCard ---
export interface EventCardProps {
  title: string;
  organizer: string;
  date: string;
  location: string;
  category: string;
  onExplore?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ title, organizer, date, location, category, onExplore }) => {
  return (
    <Card hoverable className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="primary">{category}</Badge>
          <span className="text-[11px] font-medium text-slate-400">{organizer}</span>
        </div>

        <h4 className="text-base font-semibold text-slate-900 mb-3">{title}</h4>

        <div className="space-y-1.5 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-600" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {onExplore && (
        <Button variant="outline" size="sm" fullWidth onClick={onExplore}>
          Find Teammates
        </Button>
      )}
    </Card>
  );
};
