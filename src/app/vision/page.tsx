"use client";

import { useState } from "react";

function UploadImages() {
  const [productResult, setProductResult] = useState<{
    text: string;
    ecofriendly_meter: number;
  } | null>(null);
  const [receiptResult, setReceiptResult] = useState<{
    text: string;
    confirmed: boolean;
  } | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  async function handleUploadProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!productFile) {
      alert("Molimo odaberite sliku proizvoda.");
      return;
    }

    const formData = new FormData();
    formData.append("file", productFile);

    try {
      const res = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.text || data.ecofriendly_meter === undefined) {
        alert("Došlo je do greške: nedostaju podaci za proizvod.");
        return;
      }
      setProductResult({ text: data.text, ecofriendly_meter: data.ecofriendly_meter });
    } catch (error) {
      console.error("Greška pri slanju slike proizvoda:", error);
      setProductResult(null);
      alert("Došlo je do greške pri obradi slike proizvoda.");
    }
  }

  async function handleUploadReceipt(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    if (!receiptFile) {
      alert("Molimo odaberite sliku računa.");
      return;
    }
    if (!productResult) {
      alert("Prvo morate uspješno skenirati proizvod.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", receiptFile);
    formData.append("productText", productResult.text);
  
    try {
      const res = await fetch("/api/receipt", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.confirmed === undefined) {
        alert("Došlo je do greške: nedostaju podaci o potvrdi kupovine.");
        return;
      }
      setReceiptResult({ confirmed: data.confirmed, text: "" });
    } catch (error) {
      console.error("Greška pri slanju slike računa:", error);
      setReceiptResult(null);
      alert("Došlo je do greške pri obradi slike računa.");
    }
  }
  
  

  return (
    <div className="w-full flex flex-col items-center space-y-8">
      <div>
        <h3 className="mb-2 font-bold">Proizvod</h3>
        <form onSubmit={handleUploadProduct} className="flex flex-col space-y-2">
          <input
            type="file"
            name="productFile"
            accept="image/*"
            required
            onChange={(e) => setProductFile(e.target.files?.[0] || null)}
          />
          <button type="submit" className="bg-black text-white p-2">
            Pošalji sliku proizvoda
          </button>
        </form>
        {productResult && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <h4 className="font-bold">Ekstraktovani tekst iz proizvoda:</h4>
            <p>{productResult.text}</p>
            <p>Eco-friendly meter: {productResult.ecofriendly_meter}%</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 font-bold">Račun</h3>
        <form onSubmit={handleUploadReceipt} className="flex flex-col space-y-2">
          <input
            type="file"
            name="receiptFile"
            accept="image/*"
            required
            onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            disabled={!productResult}
          />
          <button type="submit" className="bg-black text-white p-2" disabled={!productResult}>
            Pošalji sliku računa
          </button>
        </form>
        {receiptResult && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <h4 className="font-bold">Kupovina potvrđena:</h4>
            <p>{receiptResult.confirmed ? "Da" : "Ne"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadImages;
