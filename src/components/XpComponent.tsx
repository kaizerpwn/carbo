"use client";

import React, { useState } from "react";
import { Flame, X, Star, Trophy, Award, ArrowUp, Medal } from "lucide-react";

interface XPComponentProps {
  xp: number;
  username: string;
  level: number;
  nextLevelXP: number;
  carbonSaved?: number;
  rank?: number;
}

const RANKS = [
  { name: "Eco Rookie", color: "from-green-400 to-green-500", icon: Star },
  { name: "Carbon Warrior", color: "from-blue-400 to-blue-500", icon: Award },
  {
    name: "Earth Guardian",
    color: "from-purple-400 to-purple-500",
    icon: Trophy,
  },
  {
    name: "Climate Champion",
    color: "from-yellow-400 to-yellow-500",
    icon: Medal,
  },
] as const;

const XPComponent: React.FC<XPComponentProps> = ({
  xp,
  username,
  level,
  nextLevelXP,
  carbonSaved = (xp * 0.233) / 100,
  rank = 0,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const progress = (xp / nextLevelXP) * 100;

  const rankDetails = RANKS[Math.min(rank, RANKS.length - 1)];

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-backgroundLight px-4 py-2 rounded-full hover:bg-[#374151] transition-colors group"
      >
        <div className="relative">
          <Flame className="w-4 h-4 text-[#4ADE80] group-hover:animate-bounce" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#4ADE80] rounded-full animate-ping" />
        </div>
        <span className="text-white font-medium">{xp} XP</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-backgroundDark rounded-3xl w-full max-w-md overflow-hidden">
            <div
              className={`bg-gradient-to-r ${rankDetails.color} p-8 relative overflow-hidden`}
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-black/10 rounded-full" />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/20">
                      <span className="text-4xl font-bold text-white">
                        {level}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <rankDetails.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-white text-2xl font-bold mb-1">
                      {username}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-white/90 font-medium">
                        {rankDetails.name}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                      <span className="text-white/70">Rank {rank + 1}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>{xp} XP</span>
                    <span>
                      {nextLevelXP - xp} XP to Level {level + 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-backgroundLight rounded-2xl p-4 hover:bg-backgroundLight/80 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-[#4ADE80]" />
                    <span className="text-white/70">Total XP</span>
                  </div>
                  <span className="text-3xl font-bold text-[#4ADE80]">
                    {xp}
                  </span>
                </div>
                <div className="bg-backgroundLight rounded-2xl p-4 hover:bg-backgroundLight/80 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-[#4ADE80]" />
                    <span className="text-white/70">CO₂ Saved</span>
                  </div>
                  <span className="text-3xl font-bold text-[#4ADE80]">
                    {carbonSaved}kg
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-medium">
                    Recent Achievements
                  </h3>
                  <button className="text-[#4ADE80] text-sm hover:underline">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-backgroundLight rounded-2xl flex items-center justify-center group hover:bg-backgroundLight/80 transition-colors"
                    >
                      <Trophy className="w-6 h-6 text-[#4ADE80] group-hover:scale-110 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Next Rewards</h3>
                <div className="bg-backgroundLight rounded-2xl p-4 flex items-center justify-between group hover:bg-backgroundLight/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-[#4ADE80]" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">
                        Next Level Reward
                      </h4>
                      <p className="text-sm text-white/50">
                        Unlock at Level {level + 1}
                      </p>
                    </div>
                  </div>
                  <ArrowUp className="w-5 h-5 text-[#4ADE80] group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default XPComponent;
