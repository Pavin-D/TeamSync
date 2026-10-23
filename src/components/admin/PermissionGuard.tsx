import React from 'react';
import { AdminPermission } from '@/services/api/adminService';
import { ShieldAlert } from 'lucide-react';

export interface PermissionGuardProps {
  requiredPermission: AdminPermission;
  userPermissions?: AdminPermission[];
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermission,
  userPermissions = [
    'VIEW_USERS',
    'MANAGE_USERS',
    'VIEW_INSTITUTIONS',
    'MANAGE_INSTITUTIONS',
    'VIEW_REPORTS',
    'MANAGE_REPORTS',
    'VIEW_EVENTS',
    'MANAGE_EVENTS',
    'VIEW_ANALYTICS',
    'MANAGE_MENTORS',
    'VIEW_AUDIT_LOGS',
  ],
  children,
}) => {
  const hasPermission = userPermissions.includes(requiredPermission);

  if (!hasPermission) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-2 my-4 text-rose-950">
        <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto" />
        <h3 className="text-sm font-bold">Access Restricted</h3>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          Your administrator account does not possess the required permission (<code className="font-mono text-rose-700">{requiredPermission}</code>).
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
