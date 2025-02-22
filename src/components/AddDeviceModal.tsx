"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Device } from "@/types/devices";

interface AddDeviceModalProps {
  onClose: () => void;
  onAdd: (
    deviceData: Omit<Device, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [powerRating, setPowerRating] = useState("");
  const [standbyPower, setStandbyPower] = useState("");
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    console.log("Submitting form...");

    try {
      const deviceData = {
        name,
        powerRating: parseFloat(powerRating),
        standbyPower: parseFloat(standbyPower),
        location,
        isActive,
        isFavorite,
      };
      console.log("Device data to be added:", deviceData);
      await onAdd(deviceData);
      console.log("Device added successfully");
      onClose();
    } catch (error) {
      console.error("Failed to add device:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-backgroundLight rounded-3xl w-full max-w-sm overflow-hidden">
        <div className="bg-[#4ADE80] p-4 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-black text-lg font-medium">Add Device</h2>
            <button
              onClick={onClose}
              className="text-black/70 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-white mb-2">Device Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-backgroundDark rounded-lg px-3 py-2 text-white border border-[#4B5563] focus:border-[#4ADE80] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Power Rating (W)</label>
            <input
              type="number"
              value={powerRating}
              onChange={(e) => setPowerRating(e.target.value)}
              className="w-full bg-backgroundDark rounded-lg px-3 py-2 text-white border border-[#4B5563] focus:border-[#4ADE80] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Standby Power (W)</label>
            <input
              type="number"
              value={standbyPower}
              onChange={(e) => setStandbyPower(e.target.value)}
              className="w-full bg-backgroundDark rounded-lg px-3 py-2 text-white border border-[#4B5563] focus:border-[#4ADE80] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-backgroundDark rounded-lg px-3 py-2 text-white border border-[#4B5563] focus:border-[#4ADE80] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="form-checkbox"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="form-checkbox"
              />
              Favorite
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4ADE80] text-black font-medium py-2 rounded-lg hover:bg-[#3aa568] transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Device"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;
