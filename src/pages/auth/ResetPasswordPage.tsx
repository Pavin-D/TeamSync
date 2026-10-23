import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PasswordInput } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import { useAuth } from '@/context/AuthContext';
import { KeyRound, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'demo_reset_token';
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await resetPassword(token, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-2">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Password Reset Complete!</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Your password has been successfully updated. You can now sign in with your new credentials.
        </p>
        <Button onClick={() => navigate('/login')} fullWidth>
          Proceed to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Set New Password</h3>
        <p className="text-xs text-slate-500 mt-1">Please enter your new password below.</p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <PasswordInput
            label="New Password *"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <PasswordStrengthIndicator password={newPassword} />
        </div>

        <PasswordInput
          label="Confirm New Password *"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          error={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : undefined}
          required
        />

        <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<KeyRound className="w-4 h-4" />}>
          Reset Password
        </Button>
      </form>
    </div>
  );
};
