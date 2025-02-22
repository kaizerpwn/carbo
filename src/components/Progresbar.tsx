'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className='w-full h-[10px] bg-gray-800 rounded-full overflow-hidden'>
      <div
        className='h-[10px] bg-green-400 transition-all duration-300 ease-out'
        style={{ width: `${safeProgress}%`, height: '10px', background: '#21D86E' }}
      />
    </div>
  );
}
