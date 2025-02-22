"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Device } from "@/types/devices";
import { DeviceCard } from "@/components/DeviceCard";
import { AddDeviceModal } from "@/components/AddDevicesModal";
import { ScheduleModal } from "@/components/ScheduleModal";
import NavBar from "@/components/NavBar";

export const DevicesView: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "Living Room TV",
      powerRating: 150,
      standbyPower: 5,
      location: "Living Room",
      isActive: true,
      isFavorite: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      schedules: [
        {
          id: "1",
          on: "08:00",
          off: "23:00",
          days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        },
      ],
    },
    {
      id: "2",
      name: "Kitchen Oven",
      powerRating: 2000,
      standbyPower: 10,
      location: "Kitchen",
      isActive: false,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const toggleDeviceStatus = (deviceId: string) => {
    setDevices(
      devices.map((device) =>
        device.id === deviceId
          ? { ...device, isActive: !device.isActive }
          : device
      )
    );
  };

  const toggleFavorite = (deviceId: string) => {
    setDevices(
      devices.map((device) =>
        device.id === deviceId
          ? { ...device, isFavorite: !device.isFavorite }
          : device
      )
    );
  };

  const handleAddDevice = (
    newDevice: Omit<Device, "id" | "createdAt" | "updatedAt">
  ) => {
    const device: Device = {
      ...newDevice,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDevices([...devices, device]);
  };

  const handleScheduleSave = (deviceId: string, schedule: any) => {
    setDevices(
      devices.map((device) => {
        if (device.id === deviceId) {
          return {
            ...device,
            schedules: [
              ...(device.schedules || []),
              { id: Math.random().toString(36).slice(2), ...schedule },
            ],
          };
        }
        return device;
      })
    );
  };

  const handleEditDevice = (updatedDevice: Device) => {
    setDevices(
      devices.map((device) =>
        device.id === updatedDevice.id ? updatedDevice : device
      )
    );
  };

  const handleDeleteDevice = (deviceId: string) => {
    setDevices(devices.filter((device) => device.id !== deviceId));
  };

  return (
    <div className="min-h-screen bg-backgroundDark pb-20">
      <div className="h-2 bg-[#4ADE80] rounded-b-lg" />

      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-xl font-bold">My Devices</h1>
            <p className="text-[#6B7280] text-sm">
              Manage your connected devices
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#4ADE80] p-2 rounded-full hover:bg-[#3aa568] transition-colors"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="space-y-6">
          {devices.some((d) => d.isFavorite) && (
            <div>
              <h2 className="text-[#6B7280] text-sm font-medium mb-3">
                Favorite Devices
              </h2>
              <div className="space-y-3">
                {devices
                  .filter((d) => d.isFavorite)
                  .map((device) => (
                    <DeviceCard
                      key={device.id}
                      device={device}
                      onToggle={toggleDeviceStatus}
                      onSchedule={(device) => {
                        setSelectedDevice(device);
                        setShowScheduleModal(true);
                      }}
                      onFavoriteToggle={toggleFavorite}
                      onEdit={handleEditDevice}
                      onDelete={handleDeleteDevice}
                    />
                  ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-[#6B7280] text-sm font-medium mb-3">
              Active Devices
            </h2>
            <div className="space-y-3">
              {devices
                .filter((d) => d.isActive && !d.isFavorite)
                .map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    onToggle={toggleDeviceStatus}
                    onSchedule={(device) => {
                      setSelectedDevice(device);
                      setShowScheduleModal(true);
                    }}
                    onFavoriteToggle={toggleFavorite}
                    onEdit={handleEditDevice}
                    onDelete={handleDeleteDevice}
                  />
                ))}
            </div>
          </div>

          <div>
            <h2 className="text-[#6B7280] text-sm font-medium mb-3">
              Inactive Devices
            </h2>
            <div className="space-y-3">
              {devices
                .filter((d) => !d.isActive && !d.isFavorite)
                .map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    onToggle={toggleDeviceStatus}
                    onSchedule={(device) => {
                      setSelectedDevice(device);
                      setShowScheduleModal(true);
                    }}
                    onFavoriteToggle={toggleFavorite}
                    onEdit={handleEditDevice}
                    onDelete={handleDeleteDevice}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddDeviceModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDevice}
        />
      )}

      {showScheduleModal && selectedDevice && (
        <ScheduleModal
          device={selectedDevice}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedDevice(null);
          }}
          onSave={handleScheduleSave}
        />
      )}
      <NavBar />
    </div>
  );
};

export default DevicesView;
