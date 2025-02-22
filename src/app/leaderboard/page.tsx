"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Medal, ChevronRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: string;
  name: string;
  points: number;
  rank: number;
  co2Saved: number;
}

const LeaderboardView: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<string>("all-time");
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const locationFilter = location ? user?.locationId : "";
        const response = await fetch(
          `/api/leaderboard?period=${filter}&locationId=${locationFilter}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data = await response.json();
        console.log("Leaderboard data:", data);
        setUsers(data);

        setCurrentUser(data[2]);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboard();
  }, [filter, location, user]);

  return (
    <div className="min-h-screen bg-backgroundDark pb-20">
      <div className="h-2 bg-[#4ADE80] rounded-b-lg" />

      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-xl font-bold">Leaderboard</h1>
            <p className="text-[#6B7280] text-sm">Compete with other heroes</p>
          </div>
          <Trophy className="w-8 h-8 text-[#4ADE80]" />
        </div>

        <div className="flex justify-between items-end mb-8 mt-4">
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 rounded-full bg-backgroundLight border-2 border-[#C0C0C0] flex items-center justify-center mb-2">
              <Medal className="w-8 h-8 text-[#C0C0C0]" />
            </div>
            <div className="h-20 w-full bg-backgroundLight rounded-t-lg flex items-center justify-center">
              <span className="text-[#C0C0C0] font-bold text-xl">2</span>
            </div>
          </div>

          <div className="flex flex-col items-center flex-1 -mt-4">
            <div className="w-20 h-20 rounded-full bg-backgroundLight border-2 border-[#FFD700] flex items-center justify-center mb-2">
              <Trophy className="w-10 h-10 text-[#FFD700]" />
            </div>
            <div className="h-24 w-full bg-backgroundLight rounded-t-lg flex items-center justify-center">
              <span className="text-[#FFD700] font-bold text-2xl">1</span>
            </div>
          </div>

          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 rounded-full bg-backgroundLight border-2 border-[#CD7F32] flex items-center justify-center mb-2">
              <Medal className="w-8 h-8 text-[#CD7F32]" />
            </div>
            <div className="h-16 w-full bg-backgroundLight rounded-t-lg flex items-center justify-center">
              <span className="text-[#CD7F32] font-bold text-xl">3</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={`bg-backgroundLight rounded-xl p-4 ${
                user.id === currentUser?.id ? "border-2 border-[#4ADE80]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-white font-bold">
                    {user.rank}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{user.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#4ADE80]">{user.points} pts</span>
                      <span className="text-[#6B7280]">•</span>
                      <span className="text-[#6B7280]">
                        {user.co2Saved} kg saved
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              </div>

              <div className="mt-3 h-2 bg-[#333] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4ADE80] rounded-full"
                  style={{ width: `${(user.points / 2500) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={() => setFilter("weekly")}
            className={`bg-backgroundLight rounded-xl p-4 pl-7 text-left hover:bg-[#333] transition-colors relative ${
              filter === "weekly" ? "border-2 border-[#4ADE80]" : ""
            }`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-primaryColor rounded-bl-lg rounded-tl-lg" />
            <h3 className="text-white font-medium">Weekly</h3>
            <p className="text-[#6B7280] text-sm">This week&apos;s heroes</p>
          </button>
          <button
            onClick={() => setFilter("monthly")}
            className={`bg-backgroundLight rounded-xl p-4 pl-7 text-left hover:bg-[#333] transition-colors relative ${
              filter === "monthly" ? "border-2 border-[#4ADE80]" : ""
            }`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-primaryColor rounded-bl-lg rounded-tl-lg" />
            <h3 className="text-white font-medium">Monthly</h3>
            <p className="text-[#6B7280] text-sm">
              This month&apos;s champions
            </p>
          </button>
          <button
            onClick={() => setFilter("all-time")}
            className={`bg-backgroundLight rounded-xl p-4 pl-7 text-left hover:bg-[#333] transition-colors relative ${
              filter === "all-time" ? "border-2 border-[#4ADE80]" : ""
            }`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-primaryColor rounded-bl-lg rounded-tl-lg" />
            <h3 className="text-white font-medium">All Time</h3>
            <p className="text-[#6B7280] text-sm">Legendary players</p>
          </button>
          <button
            onClick={() => setLocation(location ? "" : "userCity")}
            className={`bg-backgroundLight rounded-xl p-4 pl-7 text-left hover:bg-[#333] transition-colors relative ${
              location ? "border-2 border-[#4ADE80]" : ""
            }`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-primaryColor rounded-bl-lg rounded-tl-lg" />
            <h3 className="text-white font-medium">Location</h3>
            <p className="text-[#6B7280] text-sm">Compare with your city</p>
          </button>
        </div>
        <NavBar />
      </div>
    </div>
  );
};

export default LeaderboardView;
