import NavBar from "@/components/NavBar";
import { Zap } from "lucide-react";

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
            <h2 className="text-white text-lg font-[1000]">Your tree</h2>
            <p className="text-[#6B7280] text-sm font-semibold">
              Metrics during the last 7 days
            </p>
          </div>
        </div>

        <div className="bg-backgroundLight rounded-2xl mb-6">
          <div className="flex relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="bg-[#FFFFFF07] p-4 pr-7 relative w-full">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-primaryColor rounded-bl-lg rounded-tl-lg" />

                <div className="mb-6 ml-2">
                  <div className="text-white text-4xl font-[1000]">
                    85<span className="text-xl font-[300]">%</span>
                  </div>
                  <div className="text-[#6B7280] text-sm">CO2 Emissions</div>
                </div>

                <div className="ml-2">
                  <div className="text-white text-4xl font-[1000]">
                    13<span className="text-xl font-[300]">%</span>
                  </div>
                  <div className="text-[#6B7280] text-sm">Progress</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center p-4 absolute right-0 mr-4">
              <div className="relative w-48 h-48">
              <svg width="250" height="250" viewBox="-5 -50 250 250" version="1.1" xmlns="http://www.w3.org/2000/svg" className="rotate-[90deg]">
              <circle r="90" cx="100" cy="100" fill="transparent" stroke="#e0e0e0" strokeWidth="6"></circle>
              <circle r="90" cx="100" cy="100" stroke="#76e5b1" strokeWidth="6" strokeLinecap="round" strokeDashoffset="200px" fill="transparent" strokeDasharray="565.48px"></circle>
              </svg>

                <div className="absolute inset-0 flex items-center justify-center p-10 mt-4">
                  <svg width="583" height="613" viewBox="0 0 583 613" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M260 436.5L240.5 420L216 427L259 472.5L253 613H316.5L311.5 493L369.5 431.5L367.5 411L310.5 459L308.5 397L261.5 394.5L260 436.5Z" fill="#E88687"/>
                    <circle cx="336.5" cy="322.5" r="99.5" fill="#6FD4A1"/>
                    <ellipse cx="483.5" cy="303.5" rx="99.5" ry="103.5" fill="#6FD4A1"/>
                    <ellipse cx="436.5" cy="158.5" rx="99.5" ry="103.5" fill="#6FD4A1"/>
                    <circle cx="299.5" cy="103.5" r="103.5" fill="#6FD4A1"/>
                    <circle cx="179.5" cy="158.5" r="103.5" fill="#6FD4A1"/>
                    <circle cx="103.5" cy="284.5" r="103.5" fill="#6FD4A1"/>
                    <circle cx="198.5" cy="326.5" r="103.5" fill="#6FD4A1"/>
                    <circle cx="295.5" cy="215.5" r="103.5" fill="#6FD4A1"/>
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

          <NavBar />

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
    </div>
  );
}
