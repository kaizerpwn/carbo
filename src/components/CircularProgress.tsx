const SemiCircleProgress = ({ percentage, color }: { percentage: number; color: string }) => {
  const radius = 50;
  const strokeWidth = 6;
  const circumference = Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <div className='absolute top-0'>
      <svg width='240' height='140' viewBox='0 0 120 60' className='h-[220px] pb-7'>
        <path
          d='M 10,50 A 50,50 0 0,1 110,50'
          fill='none'
          stroke='#FFF'
          strokeWidth={strokeWidth}
        />
        <path
          d='M 10,50 A 50,50 0 0,1 110,50'
          fill='none'
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress},${circumference}`}
          strokeLinecap='round'
        />
        <path
          d='M 4,55 A 50,55 0 0,1 115,55'
          fill='none'
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`1,15`}
          strokeLinecap='butt'
          strokeDashoffset='30'
          className='border-[#FF0000] stroke-[#FFFFFF44]'
        />
        <path
          d='M 10,50 A 50,50 0 0,1 110,50'
          fill='none'
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress},${circumference}`}
          strokeLinecap='round'
        />
      </svg>
    </div>
  );
};

export default SemiCircleProgress;
