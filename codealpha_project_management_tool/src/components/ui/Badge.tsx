import React from 'react';

export interface BadgeProps {
  variant?: 'purple' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'slate';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'purple',
  children,
  className = '',
}) => {
  const variantStyles = {
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    slate: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  };

  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
