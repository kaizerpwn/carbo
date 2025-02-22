import Image from 'next/image';

interface TransportStepProps {
  onContinue: () => void;
}

const transport = ['Car', 'Walk', 'Bcycle', 'Public transport'];

export default function HeatHome({ onContinue }: TransportStepProps) {
  return (
    <div className='min-h-screen bg-gray-900 p-6 text-white'>
      <div className='flex justify-center mb-2'>
        <div className='relative'>
          <Image src={'/car.png'} alt='car' height={200} width={500} />
        </div>
      </div>

      <h1 className='text-2xl font-semibold text-center mb-12'>
        What is your most used mode of transport?
      </h1>

      <div className='grid grid-cols-2 gap-4 mb-8'>
        {['Wood or pellets', 'Renewable sources'].map((i) => (
          <button
            key={i}
            className='relative bg-gray-800 rounded-lg p-4 h-16 flex items-center justify-center group'
          >
            <div className='absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-full' />
            <span className='text-gray-200'>Car</span>
          </button>
        ))}
      </div>

      <button
        onClick={onContinue}
        className='w-full bg-emerald-500 text-white py-4 rounded-lg text-lg font-medium hover:bg-emerald-600 transition-colors'
      >
        Continue
      </button>
    </div>
  );
}
