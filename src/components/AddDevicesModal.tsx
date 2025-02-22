"use client";

import React, { useState } from "react";
import { X, Plug2, MapPin, Zap, Star } from "lucide-react";
import { AddDeviceModalProps } from "@/types/devices";
import { DeviceAPI } from "@/lib/Device/Device";
import { useAuth } from "@/context/AuthContext";

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  onClose,
  onAdd,
}) => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [powerRating, setPowerRating] = useState(0);
  const [standbyPower, setStandbyPower] = useState(0);
  const [isActive, _] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      const newDevice = await DeviceAPI.createDevice({
        userId: user.id,
        name,
        location,
        powerRating,
        standbyPower,
        isActive,
        isFavorite,
      });
      onAdd(newDevice);
      onClose();
    } catch (error) {
      console.error("Failed to create device:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-backgroundLight rounded-3xl w-full max-w-sm overflow-hidden">
        <div className="bg-[#4ADE80] p-4 relative">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-black text-lg font-medium">Add New Device</h2>
              <p className="text-black/70 text-sm">
                Connect a new device to track
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-black/70 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/90 text-sm">
              <Plug2 className="w-4 h-4" />
              Device Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-backgroundDark rounded-xl p-3 text-white border border-white/10 focus:border-[#4ADE80] focus:outline-none placeholder:text-white/30"
              placeholder="e.g., Living Room TV"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/90 text-sm">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-backgroundDark rounded-xl p-3 text-white border border-white/10 focus:border-[#4ADE80] focus:outline-none placeholder:text-white/30"
              placeholder="e.g., Living Room"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white/90 text-sm">
                <Zap className="w-4 h-4" />
                Power Rating (W)
              </label>
              <input
                type="number"
                value={powerRating}
                onChange={(e) => setPowerRating(Number(e.target.value))}
                className="w-full bg-backgroundDark rounded-xl p-3 text-white border border-white/10 focus:border-[#4ADE80] focus:outline-none placeholder:text-white/30"
                placeholder="150"
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white/90 text-sm">
                <Zap className="w-4 h-4" />
                Standby Power (W)
              </label>
              <input
                type="number"
                value={standbyPower}
                onChange={(e) => setStandbyPower(Number(e.target.value))}
                className="w-full bg-backgroundDark rounded-xl p-3 text-white border border-white/10 focus:border-[#4ADE80] focus:outline-none placeholder:text-white/30"
                placeholder="5"
                required
                min="0"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFavorite((prev) => !prev)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border ${
              isFavorite
                ? "bg-backgroundDark border-[#4ADE80]"
                : "bg-backgroundDark border-white/10"
            }`}
          >
            <div className="flex items-center gap-2 text-white/90">
              <Star
                className={isFavorite ? "fill-[#4ADE80] text-[#4ADE80]" : ""}
                size={16}
              />
              <span className="text-sm">Add to favorites</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border ${
                isFavorite ? "border-[#4ADE80] bg-[#4ADE80]" : "border-white/30"
              }`}
            >
              {isFavorite && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              )}
            </div>
          </button>

          <button
            type="submit"
            className="w-full bg-[#4ADE80] text-black font-medium p-3 rounded-xl mt-2"
          >
            Add Device
          </button>
        </form>
      </div>
    </div>
  );
};
