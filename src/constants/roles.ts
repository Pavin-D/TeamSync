export const ROLES = {
  STUDENT: 'STUDENT',
  PROFESSIONAL: 'PROFESSIONAL',
  ADMIN: 'PLATFORM_ADMIN',
  COLLEGE: 'COLLEGE_ADMIN',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES] | 'ADMIN' | 'COLLEGE';

export interface RoleConfig {
  id: string;
  label: string;
  description: string;
  defaultPath: string;
  badgeColor: string;
}

export const ROLE_CONFIGS: Record<string, RoleConfig> = {
  [ROLES.STUDENT]: {
    id: ROLES.STUDENT,
    label: 'Student',
    description: 'College & university students looking for teammates, events, and skill recommendations',
    defaultPath: '/student/dashboard',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  [ROLES.PROFESSIONAL]: {
    id: ROLES.PROFESSIONAL,
    label: 'Professional / Mentor',
    description: 'Working professionals, industry experts, and hackathon mentors',
    defaultPath: '/professional/dashboard',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  [ROLES.COLLEGE]: {
    id: ROLES.COLLEGE,
    label: 'College / Institution',
    description: 'Educational institutions, departments, and official event organizers',
    defaultPath: '/college/dashboard',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  [ROLES.ADMIN]: {
    id: ROLES.ADMIN,
    label: 'System Admin',
    description: 'Platform administrators managing institutions, safety, and system health',
    defaultPath: '/admin/dashboard',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  ADMIN: {
    id: 'ADMIN',
    label: 'System Admin',
    description: 'Platform administrators managing institutions, safety, and system health',
    defaultPath: '/admin/dashboard',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

export const ALL_ROLES: UserRole[] = [
  ROLES.STUDENT,
  ROLES.PROFESSIONAL,
  ROLES.COLLEGE,
  ROLES.ADMIN,
];
