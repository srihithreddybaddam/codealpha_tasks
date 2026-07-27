import React from 'react';

const ProductSkeleton = ({ count = 8, viewMode = 'grid' }) => {
  const items = Array.from({ length: count });

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {items.map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-6 items-center"
          >
            <div className="w-full sm:w-56 h-44 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-3 w-full">
              <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 space-y-4"
        >
          <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-5 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
