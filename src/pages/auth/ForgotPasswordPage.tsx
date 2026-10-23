import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextInput } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send password reset email');
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
        <h3 className="text-lg font-bold text-slate-900">Check Your Email</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          We have sent password reset instructions to <strong className="text-slate-800">{email}</strong>.
        </p>
        <div className="pt-2">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Forgot Password?</h3>
        <p className="text-xs text-slate-500 mt-1">
          Enter your registered email address and we'll send you a password reset link.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Registered Email Address *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@university.edu or company.com"
          required
        />

        <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<KeyRound className="w-4 h-4" />}>
          Send Reset Link
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};
