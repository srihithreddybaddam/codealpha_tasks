import React from 'react';

export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-primary/20 border-t-primary rounded-full animate-spin`}
      ></div>
      <span className="text-xs font-semibold text-primary tracking-wider uppercase">Loading Vibely...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
