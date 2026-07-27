import React from 'react';

const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'accent'
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ripple-effect rounded-full';
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-md hover:shadow-glow hover:-translate-y-0.5',
    secondary: 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-md hover:shadow-glow hover:-translate-y-0.5',
    accent: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-glow hover:-translate-y-0.5',
    outline: 'border-2 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40',
    ghost: 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current mr-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="text-lg" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
