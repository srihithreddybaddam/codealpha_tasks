import React from 'react';

export default function SearchSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-white rounded-2xl border border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high"></div>
            <div className="space-y-1.5">
              <div className="w-32 h-4 bg-surface-container-high rounded-md"></div>
              <div className="w-20 h-3 bg-surface-container-low rounded-md"></div>
            </div>
          </div>
          <div className="w-20 h-8 bg-surface-container-low rounded-full"></div>
        </div>
      ))}
    </div>
  );
}
