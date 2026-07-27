import React from 'react';

const Skeleton = ({ className = '', variant = 'text', width, height }) => {
  const baseClasses = 'bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg';
  
  const variantClasses = {
    text: 'h-4 w-full my-1',
    circular: 'rounded-full',
    rectangular: 'w-full h-32',
    card: 'w-full h-64 rounded-[18px]',
  };

  const style = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} style={style} />;
};

export default Skeleton;
