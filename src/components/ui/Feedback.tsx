import React, { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Loader2, AlertTriangle, CheckCircle, Info, XCircle, Inbox, X } from 'lucide-react';
import { Button, SecondaryButton, DangerButton } from './Button';

// --- LoadingSpinner ---
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className, label }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-2">
      <Loader2 className={cn('animate-spin text-brand-600', sizeClasses[size], className)} />
      {label && <span className="text-xs text-slate-500 font-medium">{label}</span>}
    </div>
  );
};

// --- SkeletonLoader ---
export interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'avatar' | 'table';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'text', count = 1, className }) => {
  const items = Array.from({ length: count });

  if (variant === 'avatar') {
    return <div className={cn('w-10 h-10 rounded-full bg-slate-200 animate-pulse', className)} />;
  }

  if (variant === 'card') {
    return (
      <div className="grid gap-4">
        {items.map((_, i) => (
          <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-subtle space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((_, i) => (
        <div key={i} className={cn('h-4 bg-slate-200 rounded animate-pulse w-full', className)} />
      ))}
    </div>
  );
};

// --- EmptyState ---
export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There are no items to display right now.',
  icon = <Inbox className="w-10 h-10 text-slate-300" />,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-subtle', className)}>
      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
};

// --- ErrorState ---
export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load data from the server. Please check your connection.',
  onRetry,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-6 bg-rose-50/50 border border-rose-200 rounded-2xl', className)}>
      <XCircle className="w-10 h-10 text-rose-500 mb-2" />
      <h3 className="text-sm font-semibold text-rose-900 mb-1">{title}</h3>
      <p className="text-xs text-rose-600 max-w-md mb-4">{message}</p>
      {onRetry && (
        <SecondaryButton size="sm" onClick={onRetry}>
          Try Again
        </SecondaryButton>
      )}
    </div>
  );
};

// --- SuccessMessage ---
export interface SuccessMessageProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ title, message, onDismiss }) => {
  return (
    <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <p className="text-emerald-700">{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-emerald-600 hover:text-emerald-800">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// --- Toast ---
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  type?: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type = 'info', title, message, onClose }) => {
  const typeConfig: Record<ToastType, { bg: string; border: string; text: string; icon: ReactNode }> = {
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: <CheckCircle className="w-5 h-5 text-emerald-600" /> },
    error: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', icon: <XCircle className="w-5 h-5 text-rose-600" /> },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', icon: <AlertTriangle className="w-5 h-5 text-amber-600" /> },
    info: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-900', icon: <Info className="w-5 h-5 text-sky-600" /> },
  };

  const config = typeConfig[type];

  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-xl border shadow-popover max-w-sm w-full', config.bg, config.border)}>
      <div className="shrink-0">{config.icon}</div>
      <div className="flex-1 text-xs">
        <h4 className={cn('font-semibold', config.text)}>{title}</h4>
        {message && <p className="text-slate-600 mt-0.5">{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// --- ConfirmationDialog ---
export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-6 text-left border border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn('p-2.5 rounded-full', isDanger ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600')}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        </div>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">{description}</p>
        <div className="flex justify-end gap-3">
          <SecondaryButton size="sm" onClick={onCancel}>
            {cancelLabel}
          </SecondaryButton>
          {isDanger ? (
            <DangerButton size="sm" onClick={onConfirm}>
              {confirmLabel}
            </DangerButton>
          ) : (
            <Button size="sm" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
