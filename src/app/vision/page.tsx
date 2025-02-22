'use client';

import { useState } from 'react';

function UploadProductImage() {
  const [result, setResult] = useState<any>(null);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/vision/eco', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className='w-full flex justify-center items-center h-40 flex-col'>
      <form onSubmit={handleUpload} className='flex flex-col'>
        <input type='file' name='file' accept='image/*' required />
        <button type='submit' className='bg-black text-white p-4'>
          Pošalji sliku
        </button>
      </form>
      {result && (
        <div>
          <h3>Rezultat:</h3>
          <p>{result.ecoFriendly ? 'Eko friendly' : 'Nije eko friendly'}</p>
          <p>Confidence: {result.confidence.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default UploadProductImage;
