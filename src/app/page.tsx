import NavBar from '@/components/NavBar';
import { Zap } from 'lucide-react';

export default function Dashboard() {
  const coEmissionPercent = 70;
  const CoTreeSvg = () => {
    if (coEmissionPercent < 50) {
      return (
        <svg
          width='583'
          height='613'
          viewBox='0 0 583 613'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M260 436.5L240.5 420L216 427L259 472.5L253 613H316.5L311.5 493L369.5 431.5L367.5 411L310.5 459L308.5 397L261.5 394.5L260 436.5Z'
            fill='#E88687'
          />
          <circle cx='336.5' cy='322.5' r='99.5' fill='#6FD4A1' />
          <ellipse cx='483.5' cy='303.5' rx='99.5' ry='103.5' fill='#6FD4A1' />
          <ellipse cx='436.5' cy='158.5' rx='99.5' ry='103.5' fill='#6FD4A1' />
          <circle cx='299.5' cy='103.5' r='103.5' fill='#6FD4A1' />
          <circle cx='179.5' cy='158.5' r='103.5' fill='#6FD4A1' />
          <circle cx='103.5' cy='284.5' r='103.5' fill='#6FD4A1' />
          <circle cx='198.5' cy='326.5' r='103.5' fill='#6FD4A1' />
          <circle cx='295.5' cy='215.5' r='103.5' fill='#6FD4A1' />
        </svg>
      );
    } else {
      return (
        <svg
          width='213'
          height='294'
          viewBox='0 0 213 294'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M69 89.5L49.5 73L25 80L68 125.5L62 266H125.5L120.5 146L178.5 84.5L176.5 64L119.5 112L117.5 50L70.5 47.5L69 89.5Z'
            fill='#E88687'
          />
          <path
            d='M92 153.5L85 294H148.5L139.5 176.5L159.5 146.5V128.5L139.5 146.5V128.5L187.5 77V51L139.5 92.5V0H99L92 118.5L47 71L16 77L92 153.5Z'
            fill='#D26E6F'
          />
          <g clipPath='url(#clip0_34_56)'>
            <path
              d='M212.55 75.0854C214.067 65.7573 210.552 56.6004 202.871 52.1666C195.479 47.8987 186.229 49.1617 179.02 54.591C178.315 54.1755 177.662 53.7937 177.086 53.4612L176.091 55.1844C176.667 55.5169 177.324 55.8915 178.037 56.2945C176.939 65.2525 180.471 73.8947 187.862 78.1624C195.543 82.5967 205.23 81.0628 212.55 75.0854Z'
              fill='#93B793'
            />
            <path
              d='M203.654 51.9569C195.974 47.5221 186.286 49.0564 178.967 55.0342L213.333 74.8756C214.85 65.5476 211.335 56.3907 203.654 51.9569Z'
              fill='#8AC887'
            />
            <path
              d='M188.645 77.9525C180.965 73.5183 177.449 64.3615 178.967 55.0342L213.333 74.8756C206.013 80.853 196.326 82.3869 188.645 77.9525Z'
              fill='#78C175'
            />
            <path
              d='M176.2 54.5857C176.382 54.7547 176.382 54.7547 176.874 54.9745C185.146 59.7502 208.784 72.4782 209.802 72.837C208.983 72.1339 186.141 58.027 177.869 53.2513C177.392 52.9763 177.196 52.8623 177.196 52.8623L176.2 54.5857Z'
              fill='#6DB96D'
            />
            <path
              d='M197.041 65.9027C197.041 65.9027 197.041 65.9027 197.638 65.7427C200.325 65.0229 207.735 62.4852 207.998 62.2774C207.666 62.2284 199.98 63.7363 197.293 64.4561C196.696 64.6157 196.696 64.6157 196.696 64.6157L197.041 65.9027Z'
              fill='#6DB96D'
            />
            <path
              d='M188.375 60.8995C188.375 60.8995 188.375 60.8995 188.972 60.7395C191.659 60.0197 199.069 57.4821 199.333 57.2737C199 57.2247 191.314 58.7327 188.627 59.4525C188.03 59.6125 188.03 59.6125 188.03 59.6125L188.375 60.8995Z'
              fill='#6DB96D'
            />
            <path
              d='M197.333 65.3973C197.333 65.3973 197.333 65.3973 197.493 65.9945C198.212 68.681 199.72 76.367 199.671 76.6996C199.462 76.436 196.925 69.0259 196.205 66.3394C196.045 65.7422 196.045 65.7422 196.045 65.7422L197.333 65.3973Z'
              fill='#6DB96D'
            />
            <path
              d='M188.667 60.3942C188.667 60.3942 188.667 60.3942 188.827 60.9914C189.547 63.6774 191.054 71.364 191.006 71.6965C190.797 71.4329 188.26 64.0223 187.54 61.3363C187.379 60.7392 187.379 60.7392 187.379 60.7392L188.667 60.3942Z'
              fill='#6DB96D'
            />
          </g>
          <g clipPath='url(#clip1_34_56)'>
            <path
              d='M6.79539 100.197C15.4131 104.076 25.1677 103.051 31.4383 96.7796C37.474 90.7441 38.6481 81.4824 35.2697 73.1135C35.8536 72.5399 36.3913 72.0079 36.8617 71.5374L35.4547 70.1304C34.9843 70.601 34.4525 71.1385 33.8788 71.7226C25.5101 68.344 16.2484 69.5183 10.2129 75.5538C3.94191 81.8248 2.9162 91.5793 6.79539 100.197Z'
              fill='#93B793'
            />
            <path
              d='M36.2519 69.333C36.3028 69.2822 36.3215 69.2637 36.2519 69.333Z'
              fill='#6DB96D'
            />
            <path
              d='M36.0047 69.5804C36.0583 69.5268 36.1004 69.485 36.1377 69.4475C36.069 69.5158 36.0047 69.5804 36.0047 69.5804Z'
              fill='#6DB96D'
            />
            <path
              d='M36.1785 69.4066C36.2046 69.3805 36.2293 69.3558 36.2495 69.3354C36.232 69.353 36.2073 69.3776 36.1785 69.4066Z'
              fill='#6DB96D'
            />
            <path
              d='M31.4383 97.5901C37.7098 91.3191 38.735 81.5645 34.8554 72.9472L6.79543 101.007C15.4131 104.886 25.1677 103.861 31.4383 97.5901Z'
              fill='#8AC887'
            />
            <path
              d='M10.213 76.3643C16.484 70.0933 26.2387 69.0676 34.8555 72.9472L6.79551 101.007C2.91625 92.3899 3.94196 82.6353 10.213 76.3643Z'
              fill='#78C175'
            />
            <path
              d='M36.0046 70.391C35.7942 70.523 35.7942 70.523 35.4548 70.9409C28.7008 77.6954 10.2885 97.2336 9.67831 98.1244C10.5696 97.5146 30.1078 79.1019 36.8617 72.3479C37.2507 71.9591 37.4116 71.7986 37.4116 71.7986L36.0046 70.391Z'
              fill='#6DB96D'
            />
            <path
              d='M19.6793 87.5924C19.6793 87.5924 19.6793 87.5924 19.6793 88.2108C19.6793 90.992 20.2126 98.8063 20.345 99.115C20.4784 98.8063 21.0113 90.992 21.0113 88.2108C21.0117 87.5924 21.0117 87.5924 21.0117 87.5924L19.6793 87.5924Z'
              fill='#6DB96D'
            />
            <path
              d='M26.7547 80.5171C26.7547 80.5171 26.7547 80.5171 26.7547 81.1353C26.7547 83.9166 27.288 91.7309 27.421 92.0396C27.5544 91.731 28.0872 83.9161 28.0872 81.1353C28.0872 80.5171 28.0872 80.5171 28.0872 80.5171L26.7547 80.5171Z'
              fill='#6DB96D'
            />
            <path
              d='M20.092 88.0051C20.092 88.0051 20.092 88.0051 19.4738 88.0051C16.6926 88.0051 8.87822 87.4724 8.56956 87.3389C8.87822 87.2055 16.6926 86.6726 19.4738 86.6726C20.092 86.6726 20.092 86.6726 20.092 86.6726L20.092 88.0051Z'
              fill='#6DB96D'
            />
            <path
              d='M27.1675 80.9297C27.1675 80.9297 27.1675 80.9297 26.5492 80.9297C23.7684 80.9297 15.9536 80.3964 15.6449 80.2634C15.9536 80.13 23.7684 79.5972 26.5492 79.5972C27.1675 79.5967 27.1675 79.5967 27.1675 79.5967L27.1675 80.9297Z'
              fill='#6DB96D'
            />
          </g>
          <defs>
            <clipPath id='clip0_34_56'>
              <rect width='34' height='34' fill='white' transform='translate(179 48)' />
            </clipPath>
            <clipPath id='clip1_34_56'>
              <rect
                width='34'
                height='34'
                fill='white'
                transform='translate(41.6414 74.7998) rotate(105)'
              />
            </clipPath>
          </defs>
        </svg>
      );
    }
  };

  const statusColor = coEmissionPercent < 50 ? '#21D86E' : '#FF4949';

  return (
    <div className='min-h-screen bg-backgroundDark pb-20 max-w-md mx-auto'>
      <div className='h-2 bg-primaryColor rounded-b-lg' />

      <div className='p-4'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-primaryColor flex items-center justify-center'>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='white'>
                <path d='M10 3c-1.5 0-2.7 1.2-2.7 2.7 0 1.5 1.2 2.7 2.7 2.7 1.5 0 2.7-1.2 2.7-2.7C12.7 4.2 11.5 3 10 3z' />
                <path d='M10 10c-3.3 0-6 2.7-6 6v1h12v-1c0-3.3-2.7-6-6-6z' />
              </svg>
            </div>
            <div>
              <h1 className='text-white text-lg'>Hello, Ahmed</h1>
              <p className='text-[#6B7280] text-sm'>Welcome back</p>
            </div>
          </div>
          <div className='flex items-center gap-1 bg-backgroundLight px-3 py-1 rounded-full cursor-pointer'>
            <span className='text-white'>560</span>
            <span>🔥</span>
          </div>
        </div>

        <div className='bg-backgroundLight rounded-2xl mb-6'>
          <div className='p-4'>
            <h2 className='text-white text-lg font-[1000]'>Your tree</h2>
            <p className='text-[#6B7280] text-sm font-semibold'>Metrics during the last 7 days</p>
          </div>
        </div>

        <div className='bg-backgroundLight rounded-2xl mb-6'>
          <div className='flex relative overflow-hidden'>
            <div className='flex justify-between items-start'>
              <div className='bg-[#FFFFFF07] p-4 pr-7 relative w-full'>
                <div
                  className='absolute left-0 top-0 bottom-0 w-2 rounded-bl-lg rounded-tl-lg'
                  style={{ backgroundColor: statusColor }}
                />

                <div className='mb-6 ml-2'>
                  <div className='text-white text-4xl font-[1000]'>
                    {coEmissionPercent}
                    <span className='text-xl font-[300]'>%</span>
                  </div>
                  <div className='text-[#6B7280] text-sm'>CO2 Emissions</div>
                </div>

                <div className='ml-2'>
                  <div className='text-white text-4xl font-[1000]'>
                    13<span className='text-xl font-[300]'>%</span>
                  </div>
                  <div className='text-[#6B7280] text-sm'>Progress</div>
                </div>
              </div>
            </div>

            <div className='flex justify-center p-4 absolute right-0 mr-4'>
              <div className='relative w-48 h-48'>
                <svg
                  width='250'
                  height='250'
                  viewBox='-5 -50 250 250'
                  version='1.1'
                  xmlns='http://www.w3.org/2000/svg'
                  className='rotate-[90deg]'
                >
                  <circle
                    r='90'
                    cx='100'
                    cy='100'
                    fill='transparent'
                    stroke='#e0e0e0'
                    strokeWidth='6'
                  ></circle>
                  <circle
                    r='90'
                    cx='100'
                    cy='100'
                    stroke={statusColor}
                    strokeWidth='6'
                    strokeLinecap='round'
                    strokeDashoffset='200px'
                    fill='transparent'
                    strokeDasharray='565.48px'
                  ></circle>
                </svg>

                <div className='absolute inset-0 flex items-center justify-center p-10 mt-4'>
                  {CoTreeSvg()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-white text-lg'>Favorite devices</h2>
            <span className='text-[#6B7280]'>Total 4</span>
          </div>

          <NavBar />

          <div className='relative bg-backgroundLight rounded-2xl p-4'>
            <div className='absolute left-0 top-0 bottom-0 bg-primaryColor rounded-bl-lg rounded-tl-lg w-2' />
            <div className='relative pl-4'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-[#333] flex items-center justify-center'>
                    <Zap className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h3 className='text-white'>
                      Outlet 11-0
                      <span className='w-2 h-2 rounded-full bg-primaryColor'></span>
                    </h3>
                    <p className='text-[#6B7280] text-sm'>Optimised</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-[#6B7280] text-sm'>Active wattage</p>
                  <p className='text-white'>150 kw/h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
