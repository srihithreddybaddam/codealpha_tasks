import React from 'react';

const Card = ({
  children,
  className = '',
  glass = false,
  hoverable = true,
  onClick,
  ...props
}) => {
  const baseClass = glass ? 'basketly-glass-card' : 'basketly-card';
  const hoverClass = hoverable ? 'hover-lift cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`p-6 ${baseClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
