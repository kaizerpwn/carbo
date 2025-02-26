import { useState, useRef } from 'react';
import { ScanResult } from '@/types/scan';
import { Award, CheckCircle, Flame, Receipt, XCircle } from 'lucide-react';
import { calculateCoins } from '@/util/coinCalculator';
import Camera from '@/app/scan/Camera';

export const ResultModal: React.FC<{
  result: ScanResult;
  onClose: () => void;
  onScanReceipt: (receiptFile: File) => void;
}> = ({ result, onClose, onScanReceipt }) => {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [showReceiptCamera, setShowReceiptCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setReceiptFile(e.target.files[0]);
      onScanReceipt(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image capture from camera
  const handleCameraCapture = (image: string | File) => {
    if (typeof image === 'string') {
      // Convert base64 to File
      const byteString = atob(image.split(',')[1]);
      const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const file = new File([ab], 'receipt.jpg', { type: mimeString });
      onScanReceipt(file);
    } else {
      onScanReceipt(image);
    }
    setShowReceiptCamera(false);
  };

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[50]'>
      <div className='bg-backgroundLight rounded-3xl w-full max-w-sm overflow-hidden'>
        <div className={`p-6 ${result.isEcoFriendly ? 'bg-[#4ADE80]' : 'bg-red-500'}`}>
          <div className='flex items-center gap-3'>
            {result.isEcoFriendly ? (
              <CheckCircle className='w-8 h-8 text-black' />
            ) : (
              <XCircle className='w-8 h-8 text-white' />
            )}
            <div>
              <h2 className='text-black text-lg font-medium'>
                {result.isEcoFriendly ? 'Eco-Friendly Product' : 'Not Eco-Friendly'}
              </h2>
              <p className='text-black/70 text-sm'>Eco Score: {result.score}/100</p>
            </div>
          </div>
        </div>

        <div className='p-6 space-y-4'>
          <div className='space-y-2'>
            <h3 className='text-white text-sm font-medium'>Analysis Results:</h3>
            {result.reasons.map((reason, index) => (
              <div key={index} className='bg-backgroundDark rounded-xl p-3 text-[#ffffff] text-sm'>
                {reason}
              </div>
            ))}
          </div>

          {result.isEcoFriendly && (
            <div className='bg-backgroundDark rounded-xl p-4'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                  <Award className='w-5 h-5 text-[#4ADE80]' />
                  <span className='text-white text-sm font-medium'>You will get: </span>
                </div>
                <span className='text-[#4ADE80] font-bold flex items-center'>
                  +{calculateCoins(result.score)}
                  <Flame className='ml-2 w-4 h-4 text-[#4ADE80] group-hover:animate-bounce' />
                </span>
              </div>
              <div className='space-y-2 mt-4'>
                <input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  onChange={handleReceiptUpload}
                  className='hidden'
                />
                <button
                  onClick={() => setShowReceiptCamera(true)}
                  className='w-full bg-[#4ADE80] text-black font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2'
                >
                  <Receipt className='w-4 h-4' />
                  Scan Receipt to Claim Points
                </button>

                <div className='text-gray-50 my-2 text-center'>or</div>

                <button
                  onClick={handleButtonClick}
                  className='w-full bg-[#4ADE80] text-black font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2'
                >
                  <Receipt className='w-4 h-4' />
                  Upload Receipt to Claim Points
                </button>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className='w-full bg-[#374151] text-white py-2.5 px-4 rounded-lg'
          >
            Close
          </button>
        </div>
      </div>
      {showReceiptCamera && <Camera onCapture={handleCameraCapture} isLoading={false} />}
    </div>
  );
};
