"use client";

import { useState } from "react";

function UploadProductImage() {
  const [text, setText] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault(); // ✅ Prevent default form submission

    if (!file) {
      alert("Molimo odaberite sliku.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // ✅ Send selected file

    try {
      const res = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setText(data.text || "Nema pronađenog teksta."); // ✅ Handle extracted text
    } catch (error) {
      console.error("Greška pri slanju slike:", error);
      setText("Došlo je do greške pri obradi slike.");
    }
  }

  return (
    <div className="w-full flex justify-center items-center h-40 flex-col">
      <form onSubmit={handleUpload} className="flex flex-col">
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] || null)} // ✅ Store selected file
        />
        <button type="submit" className="bg-black text-white p-4">
          Pošalji sliku
        </button>
      </form>

      {text && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h3 className="font-bold">Ekstraktovani tekst:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default UploadProductImage;
