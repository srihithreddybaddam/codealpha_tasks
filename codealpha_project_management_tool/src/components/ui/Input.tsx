import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-300 block">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-slate-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={`glass-input w-full text-xs ${leftIcon ? 'pl-9' : ''} ${rightIcon ? 'pr-9' : ''} ${
            error ? 'border-rose-500/60 focus:border-rose-500 shadow-rose-500/10' : ''
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-slate-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-rose-400 font-medium animate-shake">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
