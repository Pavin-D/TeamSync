import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROLE_CONFIGS } from '@/constants/roles';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const userDashboard = ROLE_CONFIGS[role]?.defaultPath || '/student/dashboard';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-subtle">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Access Restricted</h1>
      <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
        You don't have permission to access this page. This area is reserved for users with appropriate role authorizations.
      </p>
      <Button onClick={() => navigate(userDashboard)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
        Go to My Dashboard
      </Button>
    </div>
  );
};
