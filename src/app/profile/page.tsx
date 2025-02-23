"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ShoppingBag, Award } from "lucide-react";
import NavBar from "@/components/NavBar";

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

  const [purchasedProducts, setPurchasedProducts] = useState<
    PurchasedProduct[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weeklyEnergyData: EnergyData[] = [
    { day: "Mon", consumption: 120 },
    { day: "Tue", consumption: 150 },
    { day: "Wed", consumption: 130 },
    { day: "Thu", consumption: 140 },
    { day: "Fri", consumption: 110 },
    { day: "Sat", consumption: 90 },
    { day: "Sun", consumption: 100 },
  ];

  useEffect(() => {
    const fetchUserScans = async () => {
      try {
        const userJSON = localStorage.getItem("user");
        if (!userJSON) return;

        const user = JSON.parse(userJSON);
        const response = await fetch(`/api/userScans?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch scans");
        }

        const data = await response.json();
        setPurchasedProducts(data.scannedProducts || []);
      } catch (error) {
        console.error("Error fetching scans:", error);
        setError("Failed to load purchase history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserScans();
  }, []);

  return (
    <div className="min-h-screen bg-backgroundDark p-6 text-white">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="text-gray-400">Ahmed</p>
          </div>
          <div className="bg-backgroundLight px-4 py-2 rounded-full flex items-center">
            <Award className="w-4 h-4 text-primaryColor mr-2" />
            <span className="text-sm">{userPoints} points</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-backgroundLight p-6 rounded-xl">
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

        <div className="bg-backgroundLight p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-4">Environmental Impact</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">CO2 Emissions</span>
                <span className="text-primaryColor">{co2Reduction}%</span>
              </div>
              <div className="h-2 bg-[#FFFFFF07] rounded-full">
                <div
                  className="h-full bg-primaryColor rounded-full"
                  style={{ width: `${co2Reduction}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-primaryColor">{emissionsProgress}%</span>
              </div>
              <div className="h-2 bg-[#FFFFFF07] rounded-full">
                <div
                  className="h-full bg-primaryColor rounded-full"
                  style={{ width: `${emissionsProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-backgroundLight rounded-xl p-6 mb-16">
        <h3 className="text-lg font-medium mb-4">Purchase History</h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-6">
            <span className="block text-3xl mb-2">⚠️</span>
            {error}
          </div>
        ) : purchasedProducts.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primaryColor/10 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-primaryColor" />
            </div>
            <h3 className="text-white font-medium mb-1">No Purchases Yet</h3>
            <p className="text-gray-400 text-sm">
              Scan products to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchasedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-[#FFFFFF07] rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primaryColor/20 rounded-full flex items-center justify-center mr-4">
                    <ShoppingBag className="w-5 h-5 text-primaryColor" />
                  </div>
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-400">{product.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {product.status === "completed" ? (
                    <span className="text-primaryColor">
                      +{product.points} points
                    </span>
                  ) : (
                    <span className="text-gray-400">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <NavBar />
    </div>
  );
};

export default ProfilePage;
