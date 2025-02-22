'use client';

import React, { useState } from 'react';
import { Flame, X, Star, User, ArrowUp } from 'lucide-react';

interface XPComponentProps {
  xp: number;
  username: string;
  level: number;
  nextLevelXP: number;
}

const XPComponent: React.FC<XPComponentProps> = ({ xp, username, level, nextLevelXP }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const progress = (xp / nextLevelXP) * 100;

  return (
    <>
      {/* XP Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className='flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition-colors'
      >
        <Flame className='w-4 h-4 text-emerald-500' />
        <span className='text-white'>{xp}</span>
      </button>

      {/* XP Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4 z-100'>
          <div className='bg-gray-800 rounded-2xl w-full max-w-sm p-6 relative animate-slideUp'>
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className='absolute right-4 top-4 text-gray-400 hover:text-white'
            >
              <X className='w-5 h-5' />
            </button>

            {/* XP Header */}
            <div className='flex flex-col items-center mb-8'>
              <div className='w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4'>
                <Flame className='w-8 h-8 text-emerald-500' />
              </div>
              <h2 className='text-2xl font-bold text-white mb-1'>Your XP Details</h2>
              <p className='text-gray-400'>Keep growing!</p>
            </div>

            {/* Stats Grid */}
            <div className='space-y-6'>
              {/* Current XP */}
              <div className='bg-gray-700/50 p-4 rounded-xl'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <Star className='w-5 h-5 text-emerald-500' />
                    <span className='text-gray-200'>Current XP</span>
                  </div>
                  <span className='text-emerald-500 font-bold'>{xp} XP</span>
                </div>
              </div>

              {/* Level */}
              <div className='bg-gray-700/50 p-4 rounded-xl'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <ArrowUp className='w-5 h-5 text-emerald-500' />
                    <span className='text-gray-200'>Current Level</span>
                  </div>
                  <span className='text-emerald-500 font-bold'>{level}</span>
                </div>
                <div className='w-full bg-gray-600 rounded-full h-2 mt-2'>
                  <div
                    className='bg-emerald-500 h-2 rounded-full transition-all duration-300'
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className='flex justify-between mt-2 text-sm text-gray-400'>
                  <span>Level {level}</span>
                  <span>
                    {nextLevelXP - xp} XP to Level {level + 1}
                  </span>
                </div>
              </div>

              {/* Username */}
              <div className='bg-gray-700/50 p-4 rounded-xl'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <User className='w-5 h-5 text-emerald-500' />
                    <span className='text-gray-200'>Username</span>
                  </div>
                  <span className='text-emerald-500 font-bold'>{username}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default XPComponent;
