'use client';

import React, { useState } from 'react';
import { Power, Clock, Edit2, Trash2, ChevronRight, Star } from 'lucide-react';
import { DeviceCardProps } from '@/types/devices';

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onToggle,
  onSchedule,
  onFavoriteToggle,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className='bg-backgroundLight rounded-xl p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => onToggle(device.id, !device.isActive)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              device.isActive ? 'bg-[#4ADE80]' : 'bg-[#374151]'
            }`}
          >
            <Power className={`w-5 h-5 ${device.isActive ? 'text-white' : 'text-[#6B7280]'}`} />
          </button>
          <div>
            <div className='flex items-center gap-2'>
              <h3 className='text-white font-medium'>{device.name}</h3>
              <button
                onClick={() => onFavoriteToggle(device.id, !device.isFavorite)}
                className='hover:scale-110 transition-transform'
              >
                <Star
                  className={`w-4 h-4 ${
                    device.isFavorite ? 'fill-[#4ADE80] text-[#4ADE80]' : 'text-[#6B7280]'
                  }`}
                />
              </button>
            </div>
            <p className='text-[#6B7280] text-sm'>{device.location}</p>
          </div>
        </div>
        <button onClick={() => setShowActions(!showActions)} className='focus:outline-none'>
          <ChevronRight
            className={`w-5 h-5 text-[#6B7280] transition-transform ${
              showActions ? 'rotate-90' : ''
            }`}
          />
        </button>
      </div>

      {/* ... rest of the component stays the same ... */}

      {showActions && (
        <div className='mt-4 pt-4 border-t border-[#374151] grid grid-cols-3 gap-2'>
          <button
            onClick={() => onSchedule(device)}
            className='flex flex-col items-center gap-1 text-[#6B7280] hover:text-white transition-colors'
          >
            <Clock className='w-5 h-5' />
            <span className='text-xs'>Schedule</span>
          </button>
          <button
            onClick={() => onEdit(device)}
            className='flex flex-col items-center gap-1 text-[#6B7280] hover:text-white transition-colors'
          >
            <Edit2 className='w-5 h-5' />
            <span className='text-xs'>Edit</span>
          </button>
          <button
            onClick={() => onDelete(device.id)}
            className='flex flex-col items-center gap-1 text-[#6B7280] hover:text-red-500 transition-colors'
          >
            <Trash2 className='w-5 h-5' />
            <span className='text-xs'>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};
