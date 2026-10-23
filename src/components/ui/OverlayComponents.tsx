import React, { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

// --- Modal ---
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className={cn('bg-white rounded-2xl shadow-modal w-full overflow-hidden flex flex-col border border-slate-100 max-h-[90vh]', sizeClasses[size])}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
              {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

// --- Drawer ---
export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: 'left' | 'right';
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children, position = 'left' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div
        className={cn(
          'fixed inset-y-0 w-80 bg-white shadow-modal flex flex-col transition-transform duration-300',
          position === 'left' ? 'left-0' : 'right-0'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

// --- Dropdown ---
export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div
            className={cn(
              'absolute z-30 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-popover p-1.5 animate-in fade-in zoom-in-95',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition text-left',
                  item.danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- Tooltip ---
export interface TooltipProps {
  content: string;
  children: ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap z-40 shadow-subtle animate-in fade-in">
          {content}
        </div>
      )}
    </div>
  );
};
