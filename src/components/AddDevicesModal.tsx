"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { AddDeviceModalProps } from "@/types/devices";

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    powerRating: "",
    standbyPower: "",
    isActive: false,
    isFavorite: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      powerRating: Number(formData.powerRating),
      standbyPower: Number(formData.standbyPower),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#2A2A2A] rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-[#374151]">
          <h2 className="text-white text-lg font-medium">Add New Device</h2>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm text-white mb-1 block">Device Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-[#374151] rounded-lg px-3 py-2 text-white border border-[#4B5563] focus:border-[#4ADE80] focus:outline-none"
              placeholder="Enter device name"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white mb-1 block">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full bg-[#374151] rounded-lg px-3 py-2 text-white border border-[#4B5563] focus:border-[#4ADE80] focus:outline-none"
              placeholder="Enter location"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white mb-1 block">
              Power Rating (W)
            </label>
            <input
              type="number"
              value={formData.powerRating}
              onChange={(e) =>
                setFormData({ ...formData, powerRating: e.target.value })
              }
              className="w-full bg-[#374151] rounded-lg px-3 py-2 text-white border border-[#4B5563] focus:border-[#4ADE80] focus:outline-none"
              placeholder="Enter power rating"
              required
              min="0"
            />
          </div>

          <div>
            <label className="text-sm text-white mb-1 block">
              Standby Power (W)
            </label>
            <input
              type="number"
              value={formData.standbyPower}
              onChange={(e) =>
                setFormData({ ...formData, standbyPower: e.target.value })
              }
              className="w-full bg-[#374151] rounded-lg px-3 py-2 text-white border border-[#4B5563] focus:border-[#4ADE80] focus:outline-none"
              placeholder="Enter standby power"
              required
              min="0"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.isFavorite}
              onChange={(e) =>
                setFormData({ ...formData, isFavorite: e.target.checked })
              }
              className="rounded border-[#4B5563] text-[#4ADE80] focus:ring-[#4ADE80]"
            />
            <label htmlFor="favorite" className="text-sm text-white">
              Add to favorites
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4ADE80] text-white py-2 rounded-lg hover:bg-[#3aa568] transition-colors"
          >
            Add Device
          </button>
        </form>
      </div>
    </div>
  );
};
