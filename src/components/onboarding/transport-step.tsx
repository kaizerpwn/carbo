import Image from "next/image";
import { useState } from "react";

interface TransportStepProps {
  onContinue: (data: any) => void;
}

export default function TransportStep({ onContinue }: TransportStepProps) {
  const [selectedTransport, setSelectedTransport] = useState<string | null>(
    null
  );

  const handleContinue = () => {
    if (selectedTransport) {
      onContinue({ transport: selectedTransport });
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
        What is your most used mode of transport?
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {["🚗 Car", "🚶 Walk", "🚴 Bicycle", "🚎 Public transport"].map((i) => (
          <button
            key={i}
            onClick={() => setSelectedTransport(i)}
            className={`relative bg-gray-800 rounded-lg p-4 h-16 flex items-center justify-center group ${
              selectedTransport === i ? "border-2 border-primaryColor" : ""
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
