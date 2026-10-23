import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  useState,
  useId,
  ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import { Eye, EyeOff, Search, Upload, X, Check, ChevronDown } from 'lucide-react';

export interface BaseInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// --- TextInput ---
export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps {}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3 text-slate-400 pointer-events-none">{leftIcon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition duration-200 focus-ring',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-rose-400 focus:ring-rose-400',
              className
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-3 text-slate-400 pointer-events-none">{rightIcon}</div>}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';

// --- PasswordInput ---
export const PasswordInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <TextInput
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-slate-400 hover:text-slate-600 focus:outline-none pointer-events-auto"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
        className={className}
        {...props}
      />
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

// --- SearchInput ---
export const SearchInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, placeholder = 'Search students, teams, events, skills...', ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        type="search"
        leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        placeholder={placeholder}
        className={cn('bg-slate-50 focus:bg-white', className)}
        {...props}
      />
    );
  }
);
SearchInput.displayName = 'SearchInput';

// --- Select ---
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseInputProps {
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, className, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 appearance-none pr-10 transition duration-200 focus-ring',
              error && 'border-rose-400 focus:ring-rose-400',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {error ? <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p> : helperText ? <p className="mt-1 text-xs text-slate-500">{helperText}</p> : null}
      </div>
    );
  }
);
Select.displayName = 'Select';

// --- MultiSelect ---
export interface MultiSelectProps extends Omit<BaseInputProps, 'leftIcon' | 'rightIcon'> {
  options: SelectOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  helperText,
  error,
  options,
  value = [],
  onChange,
  placeholder = 'Select options...',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((item) => item !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="w-full text-left relative">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">{label}</label>}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full bg-white border border-slate-200 rounded-xl px-3 py-2 min-h-[42px] cursor-pointer flex flex-wrap items-center gap-1.5 transition duration-200 focus-ring',
          error && 'border-rose-400'
        )}
      >
        {value.length === 0 ? (
          <span className="text-sm text-slate-400">{placeholder}</span>
        ) : (
          value.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-medium px-2 py-0.5 rounded-md border border-brand-200"
              >
                {opt?.label || val}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(val);
                  }}
                  className="hover:text-brand-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })
        )}
        <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
      </div>

      {isOpen && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-popover max-h-48 overflow-y-auto p-1">
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer transition',
                  isSelected ? 'bg-brand-50 text-brand-700 font-medium' : 'hover:bg-slate-50 text-slate-700'
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-brand-600" />}
              </div>
            );
          })}
        </div>
      )}

      {error ? <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p> : helperText ? <p className="mt-1 text-xs text-slate-500">{helperText}</p> : null}
    </div>
  );
};

// --- Textarea ---
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className, id, rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const areaId = id || generatedId;

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={areaId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          className={cn(
            'w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition duration-200 focus-ring',
            error && 'border-rose-400 focus:ring-rose-400',
            className
          )}
          {...props}
        />
        {error ? <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p> : helperText ? <p className="mt-1 text-xs text-slate-500">{helperText}</p> : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// --- Toggle / Switch ---
export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out',
        checked ? 'bg-brand-600' : 'bg-slate-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
};

// --- FileUpload ---
export interface FileUploadProps extends BaseInputProps {
  onFileSelect?: (file: File | null) => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, helperText, error, onFileSelect, accept }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    if (onFileSelect) onFileSelect(file);
  };

  return (
    <div className="w-full text-left">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">{label}</label>}
      <label className="border-2 border-dashed border-slate-200 hover:border-brand-400 bg-slate-50 hover:bg-brand-50/40 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition text-center group">
        <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-600 mb-1 transition" />
        <span className="text-xs font-medium text-slate-700 group-hover:text-brand-700">
          {fileName ? fileName : 'Click or drag file to upload'}
        </span>
        <span className="text-[11px] text-slate-400 mt-0.5">PDF, DOCX, PNG (Max 5MB)</span>
        <input type="file" accept={accept} onChange={handleFileChange} className="hidden" />
      </label>
      {error ? <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p> : helperText ? <p className="mt-1 text-xs text-slate-500">{helperText}</p> : null}
    </div>
  );
};
