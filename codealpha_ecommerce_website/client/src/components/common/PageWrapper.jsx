import React, { useEffect } from 'react';

const PageWrapper = ({ children, title = 'Basketly' }) => {
  useEffect(() => {
    document.title = title.includes('Basketly') ? title : `${title} — Basketly`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {children}
    </div>
  );
};

export default PageWrapper;
