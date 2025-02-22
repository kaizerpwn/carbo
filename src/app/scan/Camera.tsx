'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CameraProps {
  onCapture: (imageSrc: string) => void;
  isLoading?: boolean;
}

export default function Camera({ onCapture, isLoading }: CameraProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Unable to access camera. Please make sure you have granted camera permissions.');
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageSrc = canvas.toDataURL('image/jpeg', 0.8); // 
        onCapture(imageSrc);
      }
    }
  };

  if (error) {
    return (
      <div className='fixed inset-0 bg-black flex items-center justify-center p-4'>
        <div className='bg-red-500/10 text-red-500 p-4 rounded-lg max-w-md text-center'>
          <p>{error}</p>
          <button
            onClick={() => router.push('/')}
            className='mt-4 px-4 py-2 bg-red-500 text-white rounded-lg'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black'>
      <button onClick={() => router.push('/')} className='absolute top-4 right-4 z-10 p-2'>
        <X className='w-6 h-6 text-white' />
      </button>

      <video ref={videoRef} autoPlay playsInline className='h-full w-full object-cover' />

      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
        <div className='relative w-[85%] aspect-[3/4] border-2 border-yellow-400/50'>
          <div className='absolute -left-1 -top-1 w-6 h-6 border-l-4 border-t-4 border-yellow-400'></div>
          <div className='absolute -right-1 -top-1 w-6 h-6 border-r-4 border-t-4 border-yellow-400'></div>
          <div className='absolute -left-1 -bottom-1 w-6 h-6 border-l-4 border-b-4 border-yellow-400'></div>
          <div className='absolute -right-1 -bottom-1 w-6 h-6 border-r-4 border-b-4 border-yellow-400'></div>
        </div>
      </div>

      
      <button
        onClick={captureImage}
        disabled={isLoading}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
      >
        <div className='w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center'>
          {isLoading ? (
            <Loader2 className='w-8 h-8 text-black animate-spin' />
          ) : (
            <div className='w-14 h-14 rounded-full border-2 border-black flex items-center justify-center'>
              <div className='w-12 h-12 rounded-full bg-yellow-500'></div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}