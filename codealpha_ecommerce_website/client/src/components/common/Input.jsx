import React from 'react';

const Input = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  placeholder,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          className={`input-field ${Icon ? 'pl-11' : 'pl-4'} ${
            error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium pl-1">{error}</p>}
    </div>
  );
};

export default Input;
