import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/constants/roles';
import { LoadingSpinner } from '@/components/ui/Feedback';

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" label="Authenticating session..." />
      </div>
    );
  }

  // 1. Unauthenticated -> Redirect to login (preserving target path)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role Check -> If role not allowed, redirect to /unauthorized page
  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = allowedRoles.some((allowed) => {
      if (allowed === role) return true;
      if ((allowed === 'ADMIN' || allowed === 'PLATFORM_ADMIN') && (role === 'ADMIN' || role === 'PLATFORM_ADMIN')) return true;
      if ((allowed === 'COLLEGE' || allowed === 'COLLEGE_ADMIN') && (role === 'COLLEGE' || role === 'COLLEGE_ADMIN')) return true;
      return false;
    });

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};
