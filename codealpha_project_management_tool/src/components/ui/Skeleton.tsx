import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-white/10 rounded-xl border border-white/5 ${className}`}
    />
  );
};
