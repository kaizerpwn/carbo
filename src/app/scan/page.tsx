'use client';

import React, { useState } from "react";
import { Camera as CameraIcon, Upload, Award } from "lucide-react";
import NavBar from "@/components/NavBar";
import { ScanResult } from "@/types/scan";
import { ResultModal } from "@/components/ResultModal";
import Camera from "./Camera";

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
  const [isCameraActive, setIsCameraActive] = useState(false);

  const recentScans: RecentScan[] = [
    {
      id: 1,
      productName: "Eco Paper Towels",
      date: "Today",
      isEcoFriendly: true,
      points: 50,
      claimed: true,
    },
    {
      id: 2,
      productName: "Glass Cleaner",
      date: "Yesterday",
      isEcoFriendly: true,
      points: 30,
      claimed: false,
    },
    {
      id: 3,
      productName: "Plastic Bottles",
      date: "2 days ago",
      isEcoFriendly: false,
      points: 0,
      claimed: false,
    },
  ];

  const handleScan = async (file: File) => {
    setIsScanning(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("API response:", data);
      if (!data.text || data.ecofriendly_meter === undefined || !data.eco_facts) {
        alert("Error: Missing product data.");
        return;
      }
      setScanResult({
        isEcoFriendly: data.ecofriendly_meter > 50,
        score: data.ecofriendly_meter,
        reasons: data.eco_facts,
        potentialPoints: data.ecofriendly_meter,
      });
    } catch (error) {
      console.error("Error scanning product:", error);
      alert("Error processing product image.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleCapture = (imageSrc: string) => {
    const file = base64ToFile(imageSrc, "capture.jpg");
    handleScan(file);
    setIsCameraActive(false);
  };

  // Convert base64 image to File object
  const base64ToFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error("Invalid image format");
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleScanReceipt = () => {
    console.log("Scanning receipt...");
  };

  // When camera is active, render only the Camera component.
  if (isCameraActive) {
    return <Camera onCapture={handleCapture} isLoading={isScanning} />;
  }

  return (
    <div className="min-h-screen bg-backgroundDark pb-20">
      <div className="h-2 bg-[#4ADE80] rounded-b-lg" />

      <div className="p-4 max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-white text-xl font-bold">Scan Product</h1>
          <p className="text-[#6B7280] text-sm">
            Scan or upload product details to check eco-friendliness
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Use Camera Button */}
          <button
            onClick={() => setIsCameraActive(true)}
            className="w-full bg-backgroundLight rounded-2xl p-6 text-left hover:bg-backgroundLight/80 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#374151] flex items-center justify-center">
                <CameraIcon className="w-6 h-6 text-[#4ADE80]" />
              </div>
              <div>
                <h3 className="text-white font-medium">Use Camera</h3>
                <p className="text-[#6B7280] text-sm">Scan product using camera</p>
              </div>
            </div>
          </button>

          {/* Upload Image */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && handleScan(e.target.files[0])
              }
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-full bg-backgroundLight rounded-2xl p-6 text-left hover:bg-backgroundLight/80 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#374151] flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#4ADE80]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Upload Image</h3>
                  <p className="text-[#6B7280] text-sm">
                    Choose product image from gallery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-medium">Recent Scans</h2>
            <button className="text-[#4ADE80] text-sm hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            {recentScans.map((scan) => (
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
            ))}
          </div>
        </div>
      </div>

      {isScanning && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-backgroundLight rounded-2xl p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ADE80] mx-auto mb-4" />
            <p className="text-white">Analyzing product...</p>
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

      <NavBar />
    </div>
  );
};

export default ProductScanView;
