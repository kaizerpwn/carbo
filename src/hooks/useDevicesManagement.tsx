"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Device } from "@/types/devices";
import { DeviceAPI } from "@/lib/Device/Device";
import { Schedule } from "@/types/devices";
import { useAuth } from "@/context/AuthContext";
import useDevices from "@/hooks/useDevices";

interface DeviceContextProps {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  addDevice: (
    deviceData: Omit<Device, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateDevice: (
    deviceId: string,
    deviceData: Partial<Device>
  ) => Promise<void>;
  deleteDevice: (deviceId: string) => Promise<void>;
  toggleDeviceStatus: (deviceId: string, isActive: boolean) => Promise<void>;
  toggleFavorite: (deviceId: string, isFavorite: boolean) => Promise<void>;
  addSchedule: (
    deviceId: string,
    scheduleData: Omit<Schedule, "id" | "deviceId">
  ) => Promise<void>;
  updateSchedule: (
    deviceId: string,
    scheduleId: string,
    scheduleData: Partial<Schedule>
  ) => Promise<void>;
  deleteSchedule: (deviceId: string, scheduleId: string) => Promise<void>;
}

const DeviceContext = createContext<DeviceContextProps | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { devices, isLoading, isError, error } = useDevices({
    userId: user?.id,
  });

  const addDevice = async (
    deviceData: Omit<Device, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      console.log("Sending request to add device:", deviceData);
      await DeviceAPI.createDevice(deviceData);
      console.log("Device added successfully");
      queryClient.invalidateQueries({ queryKey: ["devices", user?.id] });
    } catch (error) {
      console.error("Failed to add device:", error);
      throw new Error("Failed to add device");
    }
  };

  const updateDevice = async (
    deviceId: string,
    deviceData: Partial<Device>
  ) => {
    try {
      await DeviceAPI.updateDevice({ id: deviceId, ...deviceData });
      queryClient.invalidateQueries({ queryKey: ["devices", user?.id] });
    } catch (error) {
      console.error("Failed to update device:", error);
      throw new Error("Failed to update device");
    }
  };

  const deleteDevice = async (deviceId: string) => {
    try {
      await DeviceAPI.deleteDevice(deviceId);
      queryClient.invalidateQueries({ queryKey: ["devices", user?.id] });
    } catch (error) {
      console.error("Failed to delete device:", error);
      throw new Error("Failed to delete device");
    }
  };

  const toggleDeviceStatus = async (deviceId: string, isActive: boolean) => {
    try {
      await DeviceAPI.toggleActive(deviceId, isActive);
      queryClient.invalidateQueries({ queryKey: ["devices", user?.id] });
    } catch (error) {
      console.error("Failed to toggle device status:", error);
      throw new Error("Failed to toggle device status");
    }
  };

  const toggleFavorite = async (deviceId: string, isFavorite: boolean) => {
    try {
      await DeviceAPI.toggleFavorite(deviceId, isFavorite);
      queryClient.invalidateQueries({ queryKey: ["devices", user?.id] });
    } catch (error) {
      console.error("Failed to toggle favorite status:", error);
      throw new Error("Failed to toggle favorite status");
    }
  };

  const addSchedule = async (
    deviceId: string,
    scheduleData: Omit<Schedule, "id" | "deviceId">
  ) => {
    try {
      console.log("Sending request to add schedule:", scheduleData);
      await DeviceAPI.addSchedule(deviceId, scheduleData);
      console.log("Schedule added successfully");
      queryClient.invalidateQueries({ queryKey: ["devices", user?.id] });
    } catch (error) {
      console.error("Failed to add schedule:", error);
      throw new Error("Failed to add schedule");
    }
  };

  const updateSchedule = async (
    deviceId: string,
    scheduleId: string,
    scheduleData: Partial<Schedule>
  ) => {
    try {
      await DeviceAPI.updateSchedule(deviceId, scheduleId, scheduleData);
      queryClient.invalidateQueries({ queryKey: ["devices", user?.id] });
    } catch (error) {
      console.error("Failed to update schedule:", error);
      throw new Error("Failed to update schedule");
    }
  };

  const deleteSchedule = async (deviceId: string, scheduleId: string) => {
    try {
      await DeviceAPI.deleteSchedule(deviceId, scheduleId);
      queryClient.invalidateQueries({ queryKey: ["devices", user?.id] });
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      throw new Error("Failed to delete schedule");
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        isLoading,
        error: isError ? error.message : null,
        addDevice,
        updateDevice,
        deleteDevice,
        toggleDeviceStatus,
        toggleFavorite,
        addSchedule,
        updateSchedule,
        deleteSchedule,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevicesContext = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevicesContext must be used within a DeviceProvider");
  }
  return context;
};
