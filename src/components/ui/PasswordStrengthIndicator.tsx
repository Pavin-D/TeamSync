import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface PasswordRule {
  id: string;
  label: string;
  test: (pw: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lowercase', label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'One number', test: (pw) => /[0-9]/.test(pw) },
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

export interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password, className }) => {
  if (!password) return null;

  const passedRules = PASSWORD_RULES.filter((rule) => rule.test(password));
  const score = passedRules.length;

  const getStrengthLabel = () => {
    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (score <= 4) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getStrengthLabel();

  return (
    <div className={cn('space-y-2 mt-2 text-left', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600">Password strength:</span>
        <span className={cn('font-bold', strength.text)}>{strength.label}</span>
      </div>

      {/* Strength Bar */}
      <div className="grid grid-cols-5 gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              'h-full transition-all duration-300',
              level <= score ? strength.color : 'bg-slate-200'
            )}
          />
        ))}
      </div>

      {/* Rules checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {PASSWORD_RULES.map((rule) => {
          const isPassed = rule.test(password);
          return (
            <div key={rule.id} className="flex items-center gap-1.5 text-[11px]">
              {isPassed ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              )}
              <span className={isPassed ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
