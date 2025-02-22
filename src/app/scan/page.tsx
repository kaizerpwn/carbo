'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

export default function ScanPage() {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Konfiguracija za react-webcam (dimenzije, sl.):
  const videoConstraints = {
    facingMode: 'environment', // "user" za prednju kameru na mobitelu
    width: 1280,
    height: 720,
  };

  // Funkcija koja "hvata" sliku iz webcama:
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      setImageSrc(screenshot);
    }
  }, [webcamRef]);

  // Funkcija za slanje slike na /api/scan rutu:
  const handleSendImage = async () => {
    if (!imageSrc) return;
    setLoading(true);

    try {
      // Napravi POST request na API rutu:
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageSrc }),
      });

      if (!response.ok) {
        throw new Error('Greška prilikom slanja slike na API');
      }

      const data = await response.json();
      console.log('Odgovor s API-ja:', data);
      alert('Slika uspješno poslana!');
    } catch (error) {
      console.error(error);
      alert('Dogodila se greška prilikom slanja slike.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Scan stranica</h1>

      {/* Kamera */}
      {!imageSrc && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat='image/jpeg'
          videoConstraints={videoConstraints}
          style={{ width: '100%', maxWidth: '400px' }}
        />
      )}

      {/* Gumbi */}
      {!imageSrc ? (
        <button onClick={capture}>Slikaj</button>
      ) : (
        <>
          <img
            src={imageSrc}
            alt='Captured'
            style={{ width: '100%', maxWidth: '400px', marginTop: '20px' }}
          />
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => setImageSrc(null)}>Pokušaj ponovo</button>
            <button onClick={handleSendImage} disabled={loading}>
              {loading ? 'Šaljem...' : 'Pošalji sliku'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
