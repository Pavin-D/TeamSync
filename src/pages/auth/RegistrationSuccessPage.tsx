import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROLE_CONFIGS } from '@/constants/roles';

export const RegistrationSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { role, user } = useAuth();

  const userDashboard = ROLE_CONFIGS[role]?.defaultPath || '/student/dashboard';

  return (
    <div className="text-center space-y-4 py-4">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-subtle animate-in zoom-in-95">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">Account Created Successfully!</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          Welcome to the AI-Based Smart Team Formation System, <strong className="text-slate-800">{user?.name || 'User'}</strong>!
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Account Role:</span>
          <span className="font-semibold text-slate-800">{ROLE_CONFIGS[role]?.label || role}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Email:</span>
          <span className="font-semibold text-slate-800">{user?.email}</span>
        </div>
      </div>

      <Button
        onClick={() => navigate(userDashboard)}
        fullWidth
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Continue to Dashboard
      </Button>
    </div>
  );
};
