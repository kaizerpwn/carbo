import Image from "next/image";

interface WelcomeStepProps {
  onContinue: (data: any) => void;
}

export default function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center space-y-8">
      <Image src={"/introduce.png"} alt="introduce" width={500} height={5000} />

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Welcome, please follow next simple questions
        </h1>
        <p className="text-gray-400">Introduce yourself</p>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-lg bg-gradient-to-r bg-primaryColor text-white font-semibold hover:opacity-90 transition-opacity"
      >
        Continue
      </button>
    </div>
  );
}
