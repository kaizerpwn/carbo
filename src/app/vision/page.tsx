'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

function UploadProductImage() {
  const [text, setText] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const webcamRef = useRef<Webcam>(null);

  // Kad korisnik klikne Slikaj
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) return;

      const file = base64ToFile(screenshot, 'photo.jpg');

      setImageFile(file);
      setPreview(screenshot);
    }
  }, []);

  function base64ToFile(base64Data: string, fileName: string) {
    const arr = base64Data.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!imageFile) {
      alert('Molimo prvo uslikaj sliku.');
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const res = await fetch('/api/vision', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      setText(data.text || 'Nema pronađenog teksta.');
    } catch (error) {
      console.error('Greška pri slanju slike:', error);
      setText('Došlo je do greške pri obradi slike.');
    }
  }

  return (
    <div className='w-full flex flex-col items-center p-4'>
      <h1 className='text-xl font-bold mb-4'>Slikaj i pošalji sliku</h1>

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat='image/jpeg'
        style={{ width: '100%', maxWidth: '400px' }}
        videoConstraints={{
          facingMode: 'environment', // "user" za prednju kameru
        }}
      />

      <button onClick={capture} className='bg-blue-500 text-white p-2 mt-4'>
        Slikaj
      </button>

      {preview && (
        <div className='mt-4'>
          <img src={preview} alt='Preview' style={{ width: '100%', maxWidth: '400px' }} />
        </div>
      )}

      <form onSubmit={handleUpload} className='mt-4'>
        <button type='submit' className='bg-green-500 text-white p-2'>
          Pošalji sliku
        </button>
      </form>

      {text && (
        <div className='mt-4 p-2 bg-gray-100 rounded w-full max-w-md text-center'>
          <h3 className='font-bold'>Ekstraktovani tekst:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default UploadProductImage;
