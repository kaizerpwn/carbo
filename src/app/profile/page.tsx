"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ShoppingBag, Award, LogOut } from "lucide-react";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface PurchasedProduct {
  id: number;
  name: string;
  date: string;
  points: number;
  status: "completed" | "pending";
}

interface EnergyData {
  day: string;
  consumption: number;
}

const ProfilePage: React.FC = () => {
  const userPoints = 560;
  const emissionsProgress = 13;
  const co2Reduction = 10;

  const purchasedProducts: PurchasedProduct[] = [
    {
      id: 1,
      name: "Eco Paper Towels",
      date: "Today",
      points: 50,
      status: "completed",
    },
    {
      id: 2,
      name: "Glass Cleaner",
      date: "Yesterday",
      points: 30,
      status: "completed",
    },
    {
      id: 3,
      name: "Plastic Bottles",
      date: "2 days ago",
      points: 0,
      status: "pending",
    },
  ];

  const weeklyEnergyData: EnergyData[] = [
    { day: "Mon", consumption: 120 },
    { day: "Tue", consumption: 150 },
    { day: "Wed", consumption: 130 },
    { day: "Thu", consumption: 140 },
    { day: "Fri", consumption: 110 },
    { day: "Sat", consumption: 90 },
    { day: "Sun", consumption: 100 },
  ];

  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="text-gray-400">Ahmed</p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-full flex items-center">
            <Award className="w-4 h-4 text-emerald-500 mr-2" />
            <span className="text-sm">{userPoints} points</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-4">Energy Consumption</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyEnergyData}>
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-4">Environmental Impact</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">CO2 Emissions</span>
                <span className="text-emerald-500">{co2Reduction}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${co2Reduction}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-emerald-500">{emissionsProgress}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${emissionsProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Purchase History</h3>
        <div className="space-y-4">
          {purchasedProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4">
                  <ShoppingBag className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-400">{product.date}</p>
                </div>
              </div>
              <div className="flex items-center">
                {product.status === "completed" ? (
                  <span className="text-emerald-500">
                    +{product.points} points
                  </span>
                ) : (
                  <span className="text-gray-400">Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white font-medium px-6 py-2 rounded-xl transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <NavBar />
    </div>
  );
};

export default ProfilePage;
