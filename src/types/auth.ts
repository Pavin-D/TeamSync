import { UserRole } from '@/constants/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institution?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  switchRoleForTesting: (role: UserRole) => void;
  clearError: () => void;
}
