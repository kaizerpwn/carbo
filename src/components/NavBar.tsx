"use client";
import { Home, Maximize2, MonitorSmartphone, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const NavBar = () => {
  const router = useRouter();
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
      <div className="bg-backgroundLight flex justify-around items-center p-5 rounded-t-2xl">
        <div
          className="flex items-center gap-2"
          onClick={() => router.push("/")}
        >
          <Home className="w-5 h-5 text-primaryColor cursor-pointer" />
        </div>
        <Maximize2
          className="w-5 h-5 text-[#6B7280] cursor-pointer"
          onClick={() => router.push("/scan")}
        />
        <MonitorSmartphone
          className="w-5 h-5 text-[#6B7280] cursor-pointer"
          onClick={() => router.push("/devices")}
        />
        <Trophy
          className="w-5 h-5 text-[#6B7280] cursor-pointer"
          onClick={() => router.push("/leaderboard")}
        />
      </div>
    </div>
  );
};

export default NavBar;
