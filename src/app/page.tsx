"use client";
import SemiCircleProgress from "@/components/CircularProgress";
import CoTreeLarge from "@/components/CoTreeLarge";
import CoTreeSmall from "@/components/CoTreeSmall";
import NavBar from "@/components/NavBar";
import XPComponent from "@/components/XpComponent";
import { useAuth } from "@/context/AuthContext";
import { UserAPI } from "@/lib/User/User";
import { Airplay, Navigation, PlaneLanding } from "lucide-react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDevicesContext } from "@/hooks/useDevicesManagement";

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [nextLevelXP, setNextLevelXP] = useState<number>(0);
  const [coEmissionPercent, setCoEmissionPercent] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [totalPowerConsumption, setTotalPowerConsumption] = useState<number>(0);
  const [powerConsumptionPercent, setPowerConsumptionPercent] =
    useState<number>(0);

  const { devices, isLoading, error } = useDevicesContext();
  const { user } = useAuth();

  const steps = [
    {
      title: (
        <div className="flex justify-center items-center gap-2">
          <PlaneLanding />
          Hello, {user?.fullName.split(" ")[0]}
        </div>
      ),
      message: "Glad to see you here! This is your dashboard.",
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

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
      try {
        await UserAPI.finishTutorial(user?.id, true);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const previousState = JSON.parse(storedUser);
          previousState.finishedTutorial = true;

          localStorage.setItem("user", JSON.stringify(previousState));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (devices) {
      const totalPower = Math.floor(
        devices
          .filter((device) => device.isActive)
          .reduce((sum, device) => {
            const devicePower = parseInt(String(device.powerRating || 0));
            return sum + devicePower;
          }, 0)
      );

      setTotalPowerConsumption(totalPower);

      const activeDevicesCount = devices.filter(
        (device) => device.isActive
      ).length;

      let percentage = 0;
      if (activeDevicesCount > 0) {
        percentage = Math.min(20 + (activeDevicesCount - 1) * 15, 66);
      }

      setPowerConsumptionPercent(percentage);
    }
  }, [devices]);

  useEffect(() => {
    if (showTutorial && currentStep < steps.length) {
      const targetElement = document.querySelector(steps[currentStep].target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentStep, showTutorial]);

  useEffect(() => {
    const fetchXP = async () => {
      try {
        const response = await UserAPI.getUserStats(user?.id);
        setXp(response.totalPoints);
        setLevel(response.level);
        setNextLevelXP(response.nextLevelXP);
      } catch (error) {
        console.error("Error fetching XP data:", error);
      }
    };

    const fetchCO2Emission = async () => {
      try {
        const response = await UserAPI.getUserCO2Emission(user?.id);
        setCoEmissionPercent(response.carbonSaved);
      } catch (error) {
        console.error("Error fetching CO2 emission data:", error);
      }
    };

    const fetchProgress = async () => {
      try {
        const response = await UserAPI.getUserProgress(user?.id);
        setProgress(response.progress);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    if (user) {
      fetchXP();
      fetchCO2Emission();
      fetchProgress();
    }
  }, [user]);

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

  useEffect(() => {
    if (user?.finishedTutorial === false) {
      setShowTutorial(true);
    } else {
      setShowTutorial(false);
    }
  }, [user]);

  if (!user) return <></>;

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
              <h1 className="text-white text-lg">
                Hello, {user?.fullName.split(" ")[0]}
              </h1>
              <p className="text-[#6B7280] text-sm">Welcome back</p>
            </div>
          </div>
          <XPComponent
            xp={xp}
            username={user?.fullName.split(" ")[0]}
            level={level}
            nextLevelXP={nextLevelXP}
          />
        </div>

        <div id="step2" className={`relative ${getZIndexClass(1)}`}>
          <div className="bg-backgroundLight rounded-2xl mb-6">
            <div className="p-4">
              <h2 className="text-white text-lg font-[1000]">
                Power Consumption
              </h2>
              <p className="text-[#6B7280] text-sm font-semibold">
                Current active devices usage
              </p>
            </div>
          </div>

          <div className="bg-backgroundLight rounded-2xl mb-6">
            <div className="flex relative overflow-hidden">
              <div className="flex justify-between items-start relative w-[35%]">
                <div className="bg-[#FFFFFF07] p-4 pr-7">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-2 rounded-bl-lg rounded-tl-lg"
                    style={{
                      backgroundColor:
                        powerConsumptionPercent > 50 ? "#FF4949" : "#21D86E",
                    }}
                  />

                  <div className="mb-6 ml-2">
                    <div className="text-white text-4xl font-[1000]">
                      {totalPowerConsumption}
                      <span className="text-xl font-[300]">W</span>
                    </div>
                    <div className="text-[#6B7280] text-sm">Total Power</div>
                  </div>

                  <div className="ml-2">
                    <div className="text-white text-4xl font-[1000]">
                      {powerConsumptionPercent}
                      <span className="text-xl font-[300]">%</span>
                    </div>
                    <div className="text-[#6B7280] text-sm">Usage</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center p-4 absolute right-0 w-[65%]">
                <SemiCircleProgress
                  percentage={powerConsumptionPercent}
                  color={powerConsumptionPercent > 50 ? "#FF4949" : "#21D86E"}
                />
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center p-10 mt-4">
                    {powerConsumptionPercent < 50 ? (
                      <CoTreeLarge />
                    ) : (
                      <CoTreeSmall />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="step3"
          className={`flex justify-between isolate items-center mb-4 relative ${getZIndexClass(
            2
          )}`}
        >
          <h2 className="text-white text-lg">Favorite devices</h2>
          <span className="text-[#6B7280]">
            Total {devices?.filter((device) => device.isFavorite).length || 0}
          </span>
        </div>

        <div className="relative bg-backgroundLight rounded-2xl p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-6">
              <span className="block text-3xl mb-2">⚠️</span>
              Error loading devices
            </div>
          ) : (
            <div className="space-y-3">
              {devices
                ?.filter((device) => device.isFavorite)
                .map((device) => (
                  <div
                    key={device.id}
                    className="group hover:bg-primary/5 transition-all duration-300 bg-background/40 backdrop-blur-sm rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="w-6 h-6 text-[#22C55E]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium group-hover:text-primary transition-colors duration-300">
                            {device.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-400">
                              {device.powerRating}W
                            </span>
                            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                            <span className="text-sm text-gray-400">
                              {device.location || "No location"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                            device.isActive
                              ? "bg-green-500/10 text-green-500"
                              : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              device.isActive ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></div>
                          <span className="text-xs font-medium">
                            {device.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        {/* <button className='p-2 hover:bg-white/5 rounded-lg transition-colors duration-300'>
                          <svg
                            className='w-5 h-5 text-gray-400 hover:text-primary'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                            />
                          </svg>
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))}
              {devices?.filter((device) => device.isFavorite).length === 0 && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-medium mb-1">
                    No Favorite Devices
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Add devices to favorites to see them here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <NavBar />
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
