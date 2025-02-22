interface TreeSectionProps {
  co2Emissions: number;
  progress: number;
}

export default function TreeSection({
  co2Emissions,
  progress,
}: TreeSectionProps) {
  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-4">
      <div className="mb-6">
        <h2 className="text-white text-lg">Your tree</h2>
        <p className="text-[#6B7280] text-sm">How is your tree doing?</p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-1 bg-[#4ADE80] rounded-full" />

        <div className="pl-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-white text-[40px] font-bold leading-tight">
                {co2Emissions}%
              </div>
              <div className="text-[#6B7280] text-sm">CO2 emissions</div>
            </div>
            <div>
              <span className="text-[#6B7280] text-sm">Last 7 days</span>
              <span className="text-white text-sm ml-2">Metrics</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-white text-[40px] font-bold leading-tight">
              {progress}%
            </div>
            <div className="text-[#6B7280] text-sm">Progress</div>
          </div>

          <div className="flex justify-center items-center">
            <div className="relative w-[200px] h-[200px]">
              <svg
                className="absolute inset-0 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#333333"
                  strokeWidth="10"
                  className="opacity-40"
                />
                <path
                  d={`
                      M 50,5
                      A 45,45 0 0 1 95,50
                    `}
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <path
                    d="M50 15
                         C35 15 20 30 20 55
                         C20 75 35 80 50 80
                         C65 80 80 75 80 55
                         C80 30 65 15 50 15"
                    fill="#4ADE80"
                  />
                  <rect x="45" y="80" width="10" height="15" fill="#be8b5e" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
