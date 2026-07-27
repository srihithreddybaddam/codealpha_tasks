import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeMap[size]} border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin`}
      />
    </div>
  );
};

export default Spinner;
