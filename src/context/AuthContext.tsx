import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { ROLES, UserRole } from '@/constants/roles';
import { authService, StudentRegistrationPayload, ProfessionalRegistrationPayload, CollegeRegistrationPayload, LoginPayload } from '@/services/api/authService';

export interface ExtendedAuthContextType extends AuthContextType {
  loginWithCredentials: (payload: LoginPayload) => Promise<User>;
  registerStudent: (payload: StudentRegistrationPayload) => Promise<User>;
  registerProfessional: (payload: ProfessionalRegistrationPayload) => Promise<User>;
  registerCollege: (payload: CollegeRegistrationPayload) => Promise<User>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPw: string) => Promise<void>;
}

const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize & check existing backend session on load via PostgreSQL /auth/me endpoint
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
          }
        } catch {
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
    setError(null);
  };

  const loginWithCredentials = async (payload: LoginPayload): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(payload);
      if (response.success && response.data) {
        login(response.data.token, response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.message || 'Invalid email address or password.');
      }
    } catch (err: any) {
      const msg = err.message || 'Authentication failed. Please check your credentials.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      authService.logout().catch(() => {});
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      sessionStorage.clear();
      setError(null);
    }
  };

  const registerStudent = async (payload: StudentRegistrationPayload): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.registerStudent(payload);
      if (response.success && response.data) {
        login(response.data.token, response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.message || 'Student registration failed.');
      }
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerProfessional = async (payload: ProfessionalRegistrationPayload): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.registerProfessional(payload);
      if (response.success && response.data) {
        login(response.data.token, response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.message || 'Professional registration failed.');
      }
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerCollege = async (payload: CollegeRegistrationPayload): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.registerCollege(payload);
      if (response.success && response.data) {
        login(response.data.token, response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.message || 'College registration failed.');
      }
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    setError(null);
    const response = await authService.forgotPassword(email);
    if (!response.success) {
      throw new Error(response.message || 'Failed to request password reset.');
    }
  };

  const resetPassword = async (resetToken: string, newPw: string): Promise<void> => {
    setError(null);
    const response = await authService.resetPassword(resetToken, newPw);
    if (!response.success) {
      throw new Error(response.message || 'Failed to reset password.');
    }
  };

  const switchRoleForTesting = (newRole: UserRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        error,
        login,
        loginWithCredentials,
        logout,
        registerStudent,
        registerProfessional,
        registerCollege,
        forgotPassword,
        resetPassword,
        switchRoleForTesting,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): ExtendedAuthContextType & { role: UserRole } => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const currentRole = context.user?.role || ROLES.STUDENT;
  return { ...context, role: currentRole };
};
