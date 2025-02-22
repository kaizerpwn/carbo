"use client";
import SemiCircleProgress from "@/components/CircularProgress";
import CoTreeLarge from "@/components/CoTreeLarge";
import CoTreeSmall from "@/components/CoTreeSmall";
import NavBar from "@/components/NavBar";
import XPComponent from "@/components/XpComponent";
import { useAuth } from "@/context/AuthContext";
import { Airplay, Navigation, PlaneLanding } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const coEmissionPercent = 10;

  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const steps = [
    {
      title: (
        <div className="flex justify-center items-center gap-2">
          <PlaneLanding />
          Hello, {user?.fullName}
        </div>
      ),
      message: "Welcome back! This is your dashboard.",
      target: "#step1",
      position: "stepOne",
    },
    {
      title: (
        <div className="flex justify-center items-center gap-2">
          <Navigation />
          Your Tree
        </div>
      ),
      message: "Here you can see your metrics for the last 7 days.",
      target: "#step2",
      position: "stepTwo",
    },
    {
      title: (
        <div className="flex justify-center items-center gap-2">
          <Airplay />
          Favorite Devices
        </div>
      ),
      message: "These are your most frequently used devices.",
      target: "#step3",
      position: "stepThree",
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  useEffect(() => {
    if (showTutorial && currentStep < steps.length) {
      const targetElement = document.querySelector(steps[currentStep].target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentStep, showTutorial]);

  const CoTreeSvg = () => {
    if (coEmissionPercent < 50) {
      return <CoTreeSmall />;
    } else {
      return <CoTreeLarge />;
    }
  };

  const statusColor = coEmissionPercent < 50 ? "#21D86E" : "#FF4949";

  const getPositionClass = (position: any) => {
    switch (position) {
      case "stepOne":
        return "top-[calc(-60%)]";
      case "stepTwo":
        return "top-[calc(5%)]";
      case "stepThree":
        return "top-[calc(50%)]";
      default:
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
    }
  };

  const getZIndexClass = (index: number) => {
    if (!showTutorial) return "z-[unset]";
    if (currentStep === index) return "z-40";
    if (currentStep > index) return "z-30";
    return "z-20";
  };

  return (
    <div className="min-h-screen bg-backgroundDark pb-20 max-w-md mx-auto">
      <div className="h-2 bg-primaryColor rounded-b-lg" />

      <div className="p-4">
        <div
          id="step1"
          className={`flex justify-between items-center mb-6 relative ${getZIndexClass(
            0
          )}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primaryColor flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M10 3c-1.5 0-2.7 1.2-2.7 2.7 0 1.5 1.2 2.7 2.7 2.7 1.5 0 2.7-1.2 2.7-2.7C12.7 4.2 11.5 3 10 3z" />
                <path d="M10 10c-3.3 0-6 2.7-6 6v1h12v-1c0-3.3-2.7-6-6-6z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white text-lg">Hello, {user?.fullName}</h1>
              <p className="text-[#6B7280] text-sm">Welcome back</p>
            </div>
          </div>
          {/* <div className="flex items-center gap-1 bg-backgroundLight px-3 py-1 rounded-full cursor-pointer">
            <span className="text-white">560</span>
            <span>🔥</span>
          </div> */}
          <XPComponent
            xp={560}
            username={user?.fullName}
            level={5}
            nextLevelXP={1000}
          />
        </div>

        <div id="step2" className={`relative ${getZIndexClass(1)}`}>
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
              <div className="flex justify-between items-start relative w-[35%]">
                <div className="bg-[#FFFFFF07] p-4 pr-7">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-2 rounded-bl-lg rounded-tl-lg"
                    style={{ backgroundColor: statusColor }}
                  />

                  <div className="mb-6 ml-2">
                    <div className="text-white text-4xl font-[1000]">
                      {coEmissionPercent}
                      <span className="text-xl font-[300]">%</span>
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

              <div className="flex justify-center p-4 absolute right-0 w-[65%]">
                <SemiCircleProgress
                  percentage={coEmissionPercent}
                  color={statusColor}
                />
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center p-10 mt-4">
                    {CoTreeSvg()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            id="step3"
            className={`flex justify-between isolate items-center mb-4 relative ${getZIndexClass(
              2
            )}`}
          >
            <h2 className="text-white text-lg">Favorite devices</h2>
            <span className="text-[#6B7280]">Total 4</span>
          </div>

          <NavBar />

          <div className="relative bg-backgroundLight rounded-2xl p-4"></div>
        </div>

        {showTutorial && (
          <>
            <div className="fixed inset-0 bg-black opacity-50 z-20 pointer-events-none" />
            <div
              className={`fixed inset-0 flex items-center justify-center z-30 pointer-events-none ${getPositionClass(
                steps[currentStep].position
              )}`}
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-lg text-center rounded-lg p-6 mx-4 pointer-events-auto max-w-[15rem] relative shadow-xl border border-white/30">
                <div className="absolute -top-3 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white" />
                <h2 className="text-xl font-bold mb-2 text-white">
                  {steps[currentStep].title}
                </h2>
                <p className="mb-4 text-white">{steps[currentStep].message}</p>
                <button
                  onClick={nextStep}
                  className="bg-primaryColor text-white px-4 py-2 rounded-lg w-full transition-all duration-300 ease-in-out transform hover:bg-emerald-600 hover:shadow-lg"
                >
                  {currentStep === steps.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
            <div
              className={`fixed z-25 transition-all duration-300 ease-in-out ${steps[currentStep].target}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
