"use client";

import React, { useState } from "react";
import { Plus, Power, PowerOff } from "lucide-react";
import { Device } from "@/types/devices";
import { DeviceCard } from "@/components/DeviceCard";
import { AddDeviceModal } from "@/components/AddDevicesModal";
import { ScheduleModal } from "@/components/ScheduleModal";
import NavBar from "@/components/NavBar";
import { useDevicesContext } from "@/hooks/useDevicesManagement";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const DevicesView = () => {
  const {
    devices,
    isLoading,
    error,
    toggleDeviceStatus,
    toggleFavorite,
    deleteDevice,
    addSchedule,
    updateDevice,
  } = useDevicesContext();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  const handleAddDevice = async () => {
    try {
      setShowAddModal(false);
      queryClient.invalidateQueries({ queryKey: ["devices", user?.id] });
    } catch (error) {
      console.error("Failed to add device:", error);
    }
  };

  const handleScheduleSave = async (deviceId: string, schedule: any) => {
    try {
      await addSchedule(deviceId, schedule);
      setShowScheduleModal(false);
      setSelectedDevice(null);
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

  const handleEditDevice = async (updatedDevice: Device) => {
    try {
      await updateDevice(updatedDevice.id, updatedDevice);
    } catch (error) {
      console.error("Failed to update device:", error);
    }
  };

  const handleDeleteDevice = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      setDeviceToDelete(device);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (deviceToDelete) {
      try {
        await deleteDevice(deviceToDelete.id);
        setShowDeleteModal(false);
        setDeviceToDelete(null);
      } catch (error) {
        console.error("Failed to delete device:", error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const favoriteDevices = devices.filter((d) => d.isFavorite);
  const activeDevices = devices.filter((d) => d.isActive && !d.isFavorite);
  const inactiveDevices = devices.filter((d) => !d.isActive && !d.isFavorite);

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
          {favoriteDevices.length > 0 && (
            <div>
              <h2 className="text-[#6B7280] text-sm font-medium mb-3">
                Favorite Devices
              </h2>
              <div className="space-y-3">
                {favoriteDevices.map((device) => (
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
            {activeDevices.length > 0 ? (
              <div className="space-y-3">
                {activeDevices.map((device) => (
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
            ) : (
              <div className="text-center py-12 bg-backgroundLight rounded-2xl my-4">
                <div className="w-16 h-16  mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Power />
                </div>
                <h3 className="text-white font-medium mb-1">
                  No Active Devices
                </h3>
                <p className="text-gray-400 text-sm">
                  Add or activate devices to see them here
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-[#6B7280] text-sm font-medium mb-3">
              Inactive Devices
            </h2>
            {inactiveDevices.length > 0 ? (
              <div className="space-y-3">
                {inactiveDevices.map((device) => (
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
            ) : (
              <div className="text-center py-12 bg-backgroundLight rounded-2xl my-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <PowerOff />
                </div>
                <h3 className="text-white font-medium mb-1">
                  No Inactive Devices
                </h3>
                <p className="text-gray-400 text-sm">
                  All devices are currently active
                </p>
              </div>
            )}
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

      {showDeleteModal && deviceToDelete && (
        <DeleteConfirmationModal
          deviceName={deviceToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeviceToDelete(null);
          }}
        />
      )}

      <NavBar
        className={showDeleteModal ? "opacity-50 pointer-events-none" : ""}
      />
    </div>
  );
};

export default DevicesView;
