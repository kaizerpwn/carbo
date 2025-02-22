import Image from "next/image";
import { useState } from "react";

interface RecycleBehaveProps {
  onContinue: (data: any) => void;
}

export default function RecycleBehave({ onContinue }: RecycleBehaveProps) {
  const [selectedRecycle, setSelectedRecycle] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedRecycle) {
      onContinue({ recycle: selectedRecycle });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="flex justify-center mb-2">
        <div className="relative">
          <Image src={"/car.png"} alt="car" height={200} width={500} />
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-center mb-12">
        How often do you recycle?
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {["Always", "Sometimes", "Rarely", "Never"].map((i) => (
          <button
            key={i}
            onClick={() => setSelectedRecycle(i)}
            className={`relative bg-gray-800 rounded-lg p-4 h-16 flex items-center justify-center group ${
              selectedRecycle === i ? "border-2 border-primaryColor" : ""
            }`}
          >
            <div className="absolute left-0 h-full w-2 bg-primaryColor rounded-bl-lg rounded-tl-lg" />
            <span className="text-gray-200">{i}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-primaryColor text-white py-4 rounded-lg text-lg font-medium hover:bg-emerald-600 transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
