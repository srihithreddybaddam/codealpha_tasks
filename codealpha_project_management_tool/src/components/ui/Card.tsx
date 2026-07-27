import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`${hoverEffect ? 'glass-card' : 'glass-panel'} p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
