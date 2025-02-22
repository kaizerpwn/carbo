import {
  Home,
  Maximize2,
  MonitorSmartphone,
  Settings,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-backgroundDark pb-20 max-w-md mx-auto">
      <div className="h-2 bg-primaryColor rounded-b-lg" />

      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primaryColor flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M10 3c-1.5 0-2.7 1.2-2.7 2.7 0 1.5 1.2 2.7 2.7 2.7 1.5 0 2.7-1.2 2.7-2.7C12.7 4.2 11.5 3 10 3z" />
                <path d="M10 10c-3.3 0-6 2.7-6 6v1h12v-1c0-3.3-2.7-6-6-6z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white text-lg">Hello, Ahmed</h1>
              <p className="text-[#6B7280] text-sm">Welcome back</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-backgroundLight px-3 py-1 rounded-full cursor-pointer">
            <span className="text-white">560</span>
            <span>🔥</span>
          </div>
        </div>

        <div className="bg-backgroundLight rounded-2xl mb-6">
          <div className="p-4">
            <h2 className="text-white text-lg mb-1">Your tree</h2>
            <p className="text-[#6B7280] text-sm">How is your tree doing?</p>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="bg-backgroundDark w-48 rounded-r-lg p-4 relative">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-primaryColor rounded-bl-lg rounded-tl-lg" />

                <div className="mb-6 ml-2">
                  <div className="text-white text-4xl font-semibold">85%</div>
                  <div className="text-[#6B7280] text-sm">CO2 Emissions</div>
                </div>

                <div className="ml-2">
                  <div className="text-white text-4xl font-semibold">13%</div>
                  <div className="text-[#6B7280] text-sm">Progress</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[#6B7280] text-sm">Last 7 Days</div>
                <div className="text-white text-sm">Metrics</div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#21242D"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="10"
                    strokeDasharray="282.6"
                    strokeDashoffset="246"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <path
                      d="M30 10 C20 10 15 20 15 30 C15 40 20 45 30 45 C40 45 45 40 45 30 C45 20 40 10 30 10"
                      fill="#4ADE80"
                    />
                    <rect x="28" y="45" width="4" height="8" fill="#bc8a5f" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg">Favorite devices</h2>
            <span className="text-[#6B7280]">Total 4</span>
          </div>

          <div className="relative bg-backgroundLight rounded-2xl p-4">
            <div className="absolute left-0 top-0 bottom-0 bg-primaryColor rounded-bl-lg rounded-tl-lg w-2" />
            <div className="relative pl-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white">
                      Outlet 11-0
                      <span className="w-2 h-2 rounded-full bg-primaryColor"></span>
                    </h3>
                    <p className="text-[#6B7280] text-sm">Optimised</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#6B7280] text-sm">Active wattage</p>
                  <p className="text-white">150 kw/h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <div className="bg-backgroundLight flex justify-around items-center p-5 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primaryColor cursor-pointer" />
          </div>
          <Maximize2 className="w-5 h-5 text-[#6B7280] cursor-pointer" />
          <MonitorSmartphone className="w-5 h-5 text-[#6B7280] cursor-pointer" />
          <Settings className="w-5 h-5 text-[#6B7280] cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
