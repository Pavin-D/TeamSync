import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-ring disabled:opacity-60 disabled:cursor-not-allowed select-none';

    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-brand-500/25 active:bg-brand-800',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:bg-slate-300',
      outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 active:bg-slate-100',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-rose-500/25 active:bg-rose-800',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 active:bg-slate-200',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export const PrimaryButton: React.FC<ButtonProps> = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton: React.FC<ButtonProps> = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton: React.FC<ButtonProps> = (props) => <Button variant="outline" {...props} />;
export const DangerButton: React.FC<ButtonProps> = (props) => <Button variant="danger" {...props} />;

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', className, ...props }, ref) => {
    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'p-1.5 text-xs',
      md: 'p-2 text-sm',
      lg: 'p-3 text-base',
    };

    return (
      <Button
        ref={ref}
        size={size}
        className={cn('rounded-xl aspect-square px-0 py-0', sizeClasses[size], className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
