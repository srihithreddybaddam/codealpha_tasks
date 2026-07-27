import React from 'react';

export default function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-[24px] p-6 border border-surface-container-high shadow-sm animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-surface-container-high"></div>
            <div className="space-y-1.5 flex-1">
              <div className="w-36 h-4 bg-surface-container-high rounded-md"></div>
              <div className="w-24 h-3 bg-surface-container-low rounded-md"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-surface-container-low rounded-md"></div>
            <div className="w-3/4 h-4 bg-surface-container-low rounded-md"></div>
          </div>
          <div className="w-full h-64 bg-surface-container-low rounded-2xl"></div>
        </div>
      ))}
    </div>
  );
}
