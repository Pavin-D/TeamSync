import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TextInput, PasswordInput } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { LogIn } from 'lucide-react';
import { ROLE_CONFIGS } from '@/constants/roles';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithCredentials, isAuthenticated, role } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If user is already authenticated, redirect to their role dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const fromPath = (location.state as any)?.from?.pathname;
      const defaultPath = ROLE_CONFIGS[role]?.defaultPath || '/student/dashboard';
      navigate(fromPath || defaultPath, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const authenticatedUser = await loginWithCredentials({ email, password });
      const userRole = authenticatedUser.role || role || 'STUDENT';
      const defaultPath = ROLE_CONFIGS[userRole]?.defaultPath || '/student/dashboard';
      navigate(defaultPath, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email address or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Sign In</h3>
        <p className="text-sm text-slate-500 mt-1.5">
          Enter your credentials to securely access your workspace.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Email Address *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@university.edu or company.com"
          required
        />

        <PasswordInput
          label="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input type="checkbox" className="rounded text-brand-600 border-slate-300" defaultChecked />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-brand-600 font-semibold hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<LogIn className="w-4 h-4" />}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-brand-600 font-semibold hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
};
