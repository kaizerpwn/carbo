'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Upload, Award, CheckCircle, XCircle, Flame } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { ScanResult } from '@/types/scan';
import { ResultModal } from '@/components/ResultModal';
import CameraComponent from './Camera';
import { calculateCoins } from '@/util/coinCalculator';
import { RecentScans } from '@/components/RecentScans';

interface RecentScan {
  id: number;
  productName: string;
  date: string;
  isEcoFriendly: boolean;
  points: number;
  claimed: boolean;
}

const ProductScanView: React.FC = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isScanningReceipt, setIsScanningReceipt] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [receiptScanResult, setReceiptScanResult] = useState<boolean | null>(null);
  const [coins, setCoins] = useState(0);
  const [userScans, setUserScans] = useState<any[]>([]);

  const mockScans = [
    // {
    //   id: "1",
    //   product: {
    //     name: "Eco Paper Towels",
    //     ecoScore: 85,
    //   },
    //   scannedAt: new Date(),
    //   pointsClaimed: true,
    // },
    // {
    //   id: "2",
    //   product: {
    //     name: "Glass Cleaner",
    //     ecoScore: 75,
    //   },
    //   scannedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    //   pointsClaimed: false,
    // },
    // {
    //   id: "3",
    //   product: {
    //     name: "Plastic Bottles",
    //     ecoScore: 30,
    //   },
    //   scannedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    //   pointsClaimed: false,
    // },
  ];

  const handleScan = async (imageSrc: string | File) => {
    setIsScanning(true);

    let file: File;
    if (typeof imageSrc === 'string') {
      const byteString = atob(imageSrc.split(',')[1]);
      const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      file = new File([ab], 'scan.jpg', { type: mimeString });
    } else {
      file = imageSrc;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/vision', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.text || data.ecofriendly_meter === undefined || !data.eco_facts) {
        alert('Error: Missing product data.');
        return;
      }
      setScanResult({
        isEcoFriendly: data.ecofriendly_meter > 50,
        score: data.ecofriendly_meter,
        reasons: data.eco_facts,
        potentialPoints: data.ecofriendly_meter,
        text: data.text,
      });
    } catch (error) {
      console.error('Error scanning product:', error);
      alert('Error processing product image.');
    } finally {
      setIsScanning(false);
      setShowCamera(false);
    }
  };

  const handleScanReceipt = async (receiptFile: File) => {
    if (!scanResult) {
      alert('Please scan a product first.');
      return;
    }

    setIsScanningReceipt(true);

    const formData = new FormData();
    formData.append('file', receiptFile);
    formData.append('productText', scanResult.text);

    try {
      const res = await fetch('/api/receipt', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log('Receipt scan response:', data);

      if (data.confirmed === undefined) {
        alert('Error: Missing confirmation data.');
        return;
      }

      const userJSON = localStorage.getItem('user');
      if (userJSON) {
        const user = JSON.parse(userJSON);
        var currentUserId = user.id;
        console.log('Current user ID:', currentUserId);
      } else {
        console.log('User not found in localStorage.');
        throw new Error('User not found in localStorage.');
      }

      if (data.confirmed) {
        const coins = calculateCoins(scanResult.score);
        setCoins(coins);
        console.log('Coins to be added:', coins);

        try {
          const updateRes = await fetch('/api/userStats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: currentUserId, coins }),
          });
          const updateData = await updateRes.json();
          if (updateRes.ok) {
            console.log('User stats updated successfully.');
          } else {
            console.error('Error updating user stats:', updateData.error);
            throw new Error('Error updating user stats.');
          }
        } catch (dbError) {
          console.error('Error updating user stats:', dbError);
          throw new Error('Error updating user stats.');
        }
      }

      setReceiptScanResult(data.confirmed);
    } catch (error) {
      console.error('Error processing receipt image:', error);
      if (error instanceof Error) {
        alert(`Error processing receipt image: ${error.message}`);
      } else {
        alert('Error processing receipt image.');
      }
    } finally {
      setIsScanningReceipt(false);
    }
  };

  useEffect(() => {
    const fetchUserScans = async () => {
      try {
        const userJSON = localStorage.getItem('user');
        if (!userJSON) return;

        const user = JSON.parse(userJSON);
        const response = await fetch(`/api/userScans?userId=${user.id}`);
        const data = await response.json();

        setUserScans(data.scannedProducts);
      } catch (error) {
        console.error('Error fetching scans:', error);
      }
    };

    fetchUserScans();
  }, []);

  useEffect(() => {
    setUserScans(mockScans);
  }, []);

  return (
    <div className='min-h-screen bg-backgroundDark pb-20'>
      {showCamera ? (
        <CameraComponent onCapture={handleScan} isLoading={isScanning} />
      ) : (
        <>
          <div className='h-2 bg-[#4ADE80] rounded-b-lg' />

          <div className='p-4 max-w-md mx-auto'>
            <div className='mb-6'>
              <h1 className='text-white text-xl font-bold'>Scan Product</h1>
              <p className='text-[#6B7280] text-sm'>
                Scan or upload product details to check eco-friendliness
              </p>
            </div>

            <div className='space-y-4 mb-8'>
              <button
                className='w-full bg-backgroundLight rounded-2xl p-6 text-left hover:bg-backgroundLight/80 transition-colors'
                onClick={() => setShowCamera(true)}
              >
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-full bg-[#374151] flex items-center justify-center'>
                    <Camera className='w-6 h-6 text-[#4ADE80]' />
                  </div>
                  <div>
                    <h3 className='text-white font-medium'>Use Camera</h3>
                    <p className='text-[#6B7280] text-sm'>Scan product using camera</p>
                  </div>
                </div>
              </button>

              <div className='relative'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => e.target.files?.[0] && handleScan(e.target.files[0])}
                  className='absolute inset-0 opacity-0 cursor-pointer z-10'
                />
                <div className='w-full bg-backgroundLight rounded-2xl p-6 text-left hover:bg-backgroundLight/80 transition-colors'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-full bg-[#374151] flex items-center justify-center'>
                      <Upload className='w-6 h-6 text-[#4ADE80]' />
                    </div>
                    <div>
                      <h3 className='text-white font-medium'>Upload Image</h3>
                      <p className='text-[#6B7280] text-sm'>Choose product image from gallery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-white font-medium'>Recent Scans</h2>
                <button className='text-[#4ADE80] text-sm hover:underline'>View All</button>
              </div>

              <div className='space-y-3'>
                {/* {recentScans.map((scan) => (
                  <div key={scan.id} className="bg-backgroundLight rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            scan.isEcoFriendly ? "bg-[#4ADE80]" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <h3 className="text-white text-sm font-medium">
                            {scan.productName}
                          </h3>
                          <p className="text-[#6B7280] text-xs">{scan.date}</p>
                        </div>
                      </div>
                      {scan.isEcoFriendly && (
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-[#4ADE80] text-sm font-medium">
                              +{scan.points}
                            </span>
                            <Award className="w-4 h-4 text-[#4ADE80]" />
                          </div>
                          {!scan.claimed && (
                            <button className="text-[#6B7280] text-xs hover:text-[#4ADE80]">
                              Claim Points
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))} */}
                <RecentScans scans={userScans} />
              </div>
            </div>
          </div>

          {isScanning && (
            <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
              <div className='bg-backgroundLight rounded-2xl p-6 text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ADE80] mx-auto mb-4' />
                <p className='text-white'>Analyzing product...</p>
              </div>
            </div>
          )}

          {isScanningReceipt && (
            <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-[100]'>
              <div className='bg-backgroundLight rounded-2xl p-6 text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ADE80] mx-auto mb-4' />
                <p className='text-white'>Analyzing receipt...</p>
              </div>
            </div>
          )}

          {scanResult && (
            <ResultModal
              result={scanResult}
              onClose={() => setScanResult(null)}
              onScanReceipt={handleScanReceipt}
            />
          )}

          {receiptScanResult !== null && (
            <div className='fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50'>
              <div className='bg-backgroundLight rounded-3xl w-full max-w-sm overflow-hidden'>
                <div className={`p-6 ${receiptScanResult ? 'bg-[#4ADE80]' : 'bg-red-500'}`}>
                  <div className='flex items-center gap-5'>
                    {receiptScanResult ? (
                      <CheckCircle className='w-8 h-8 text-black' />
                    ) : (
                      <XCircle className='w-8 h-8 text-white' />
                    )}
                    <div>
                      <h2 className='text-black text-lg font-medium flex items-center'>
                        {receiptScanResult ? (
                          <div className='flex flex-col'>
                            <p className='font-bold'>Purchase completed.</p>
                            <p className='flex items-center '>
                              You have recieved <b className='ml-1'>{coins}</b>{' '}
                              <Flame className='mb-[1px] w-4 h-4 group-hover:animate-bounce' />
                            </p>
                          </div>
                        ) : (
                          'Purchase Not Confirmed'
                        )}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className='p-6'>
                  <button
                    onClick={() => setReceiptScanResult(null)}
                    className='w-full bg-[#374151] text-white py-2.5 px-4 rounded-lg'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <NavBar className={isScanning ? 'opacity-50' : ''} />
        </>
      )}
    </div>
  );
};

export default ProductScanView;
