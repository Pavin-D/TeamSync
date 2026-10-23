import { UserRole } from '@/constants/roles';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  badge?: string | number;
  rolesAllowed?: UserRole[];
}

export interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}
