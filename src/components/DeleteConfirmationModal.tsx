'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  deviceName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  deviceName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50'>
      <div className='bg-backgroundLight rounded-3xl w-full max-w-sm overflow-hidden'>
        <div className='bg-red-500 p-4 relative'>
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-white text-lg font-medium'>Delete Device</h2>
              <p className='text-white/70 text-sm'>This action cannot be undone</p>
            </div>
            <button onClick={onCancel} className='text-white/70 hover:text-white transition-colors'>
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        <div className='p-6'>
          <div className='flex items-center justify-center mb-6'>
            <div className='w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center'>
              <AlertTriangle className='w-8 h-8 text-red-500' />
            </div>
          </div>

          <p className='text-center text-white mb-6'>
            Are you sure you want to delete <span className='font-semibold'>{deviceName}</span>?
            This action cannot be reversed and all associated data will be permanently removed.
          </p>

          <div className='space-y-3'>
            <button
              onClick={onConfirm}
              className='w-full bg-red-500 text-white font-medium p-3 rounded-xl hover:bg-red-600 transition-colors'
            >
              Yes, Delete Device
            </button>
            <button
              onClick={onCancel}
              className='w-full bg-gray-700 text-white font-medium p-3 rounded-xl hover:bg-gray-600 transition-colors'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
