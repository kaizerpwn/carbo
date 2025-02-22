"use client";

import { Home, Maximize2, MonitorSmartphone, Trophy } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const NavBar = () => {
  const router = useRouter();
  const currentRoute = usePathname();

  const isActive = (route: any) => currentRoute === route;

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
      <div className="bg-backgroundLight flex justify-around items-center p-5 rounded-t-2xl">
        <div
          className={`flex items-center gap-2 ${
            isActive("/") ? "text-primaryColor" : "text-[#6B7280]"
          }`}
          onClick={() => router.push("/")}
        >
          <Home className="w-5 h-5 cursor-pointer" />
        </div>
        <Maximize2
          className={`w-5 h-5 ${
            isActive("/scan") ? "text-primaryColor" : "text-[#6B7280]"
          } cursor-pointer`}
          onClick={() => router.push("/scan")}
        />
        <MonitorSmartphone
          className={`w-5 h-5 ${
            isActive("/devices") ? "text-primaryColor" : "text-[#6B7280]"
          } cursor-pointer`}
          onClick={() => router.push("/devices")}
        />
        <Trophy
          className={`w-5 h-5 ${
            isActive("/leaderboard") ? "text-primaryColor" : "text-[#6B7280]"
          } cursor-pointer`}
          onClick={() => router.push("/leaderboard")}
        />
      </div>
    </div>
  );
};

export default NavBar;
