import React from 'react';

export default function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-surface-container-high shadow-sm relative animate-pulse space-y-4">
      {/* Cover Skeleton */}
      <div className="h-44 sm:h-56 bg-surface-container-low w-full"></div>

      {/* Avatar & Header Skeleton */}
      <div className="p-6 pt-0 space-y-4">
        <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-surface-container-high border-4 border-white"></div>
          <div className="w-28 h-9 rounded-full bg-surface-container-low"></div>
        </div>

        <div className="space-y-2">
          <div className="w-48 h-6 rounded-lg bg-surface-container-high"></div>
          <div className="w-32 h-4 rounded-lg bg-surface-container-low"></div>
        </div>

        <div className="w-full h-12 rounded-xl bg-surface-container-low"></div>

        <div className="flex gap-4 pt-2">
          <div className="w-24 h-4 rounded-md bg-surface-container-low"></div>
          <div className="w-32 h-4 rounded-md bg-surface-container-low"></div>
        </div>
      </div>
    </div>
  );
}
