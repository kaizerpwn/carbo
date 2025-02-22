"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Device } from "@/types/devices";
import { DeviceAPI } from "@/lib/Device/Device";
import { Schedule } from "@/types/devices";
import { useAuth } from "./AuthContext";

interface DeviceContextProps {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  addDevice: (
    deviceData: Omit<Device, "id" | "createdAt" | "updatedAt"> & {
      userId: string;
    }
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
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDevices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedDevices = await DeviceAPI.getDevices(user.id);
        setDevices(fetchedDevices);
      } catch (error) {
        setError("Failed to fetch devices");
        console.error("Error fetching devices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const addDevice = async (
    deviceData: Omit<Device, "id" | "createdAt" | "updatedAt">
  ) => {
    setError(null);
    try {
      const newDevice = await DeviceAPI.createDevice(deviceData);
      setDevices((prevDevices) =>
        Array.isArray(prevDevices) ? [...prevDevices, newDevice] : [newDevice]
      );
    } catch (error) {
      setError("Failed to add device");
      throw error;
    }
  };

  const updateDevice = async (
    deviceId: string,
    deviceData: Partial<Device>
  ) => {
    setError(null);
    try {
      const updatedDevice = await DeviceAPI.updateDevice({
        id: deviceId,
        ...deviceData,
      });
      setDevices((prevDevices) =>
        Array.isArray(prevDevices)
          ? prevDevices.map((device) =>
              device.id === deviceId ? updatedDevice : device
            )
          : []
      );
    } catch (error) {
      setError("Failed to update device");
      throw error;
    }
  };

  const deleteDevice = async (deviceId: string) => {
    setError(null);
    try {
      await DeviceAPI.deleteDevice(deviceId);
      setDevices((prevDevices) =>
        Array.isArray(prevDevices)
          ? prevDevices.filter((device) => device.id !== deviceId)
          : []
      );
    } catch (error) {
      setError("Failed to delete device");
      throw error;
    }
  };

  const toggleDeviceStatus = async (deviceId: string, isActive: boolean) => {
    setError(null);
    try {
      await DeviceAPI.toggleActive(deviceId, isActive);
      setDevices((prevDevices) =>
        Array.isArray(prevDevices)
          ? prevDevices.map((device) =>
              device.id === deviceId ? { ...device, isActive } : device
            )
          : []
      );
    } catch (error) {
      setError("Failed to toggle device status");
      throw error;
    }
  };

  const toggleFavorite = async (deviceId: string, isFavorite: boolean) => {
    setError(null);
    try {
      await DeviceAPI.toggleFavorite(deviceId, isFavorite);
      setDevices((prevDevices) =>
        Array.isArray(prevDevices)
          ? prevDevices.map((device) =>
              device.id === deviceId ? { ...device, isFavorite } : device
            )
          : []
      );
    } catch (error) {
      setError("Failed to toggle favorite status");
      throw error;
    }
  };

  const addSchedule = async (
    deviceId: string,
    scheduleData: Omit<Schedule, "id" | "deviceId">
  ) => {
    setError(null);
    try {
      const newSchedule = await DeviceAPI.addSchedule(deviceId, scheduleData);
      setDevices((prevDevices) =>
        Array.isArray(prevDevices)
          ? prevDevices.map((device) =>
              device.id === deviceId
                ? {
                    ...device,
                    schedules: [...(device.schedules || []), newSchedule],
                  }
                : device
            )
          : []
      );
    } catch (error) {
      setError("Failed to add schedule");
      throw error;
    }
  };

  const updateSchedule = async (
    deviceId: string,
    scheduleId: string,
    scheduleData: Partial<Schedule>
  ) => {
    setError(null);
    try {
      const updatedSchedule = await DeviceAPI.updateSchedule(
        deviceId,
        scheduleId,
        scheduleData
      );
      setDevices((prevDevices) =>
        Array.isArray(prevDevices)
          ? prevDevices.map((device) =>
              device.id === deviceId
                ? {
                    ...device,
                    schedules: device.schedules?.map((schedule) =>
                      schedule.id === scheduleId ? updatedSchedule : schedule
                    ),
                  }
                : device
            )
          : []
      );
    } catch (error) {
      setError("Failed to update schedule");
      throw error;
    }
  };

  const deleteSchedule = async (deviceId: string, scheduleId: string) => {
    setError(null);
    try {
      await DeviceAPI.deleteSchedule(deviceId, scheduleId);
      setDevices((prevDevices) =>
        Array.isArray(prevDevices)
          ? prevDevices.map((device) =>
              device.id === deviceId
                ? {
                    ...device,
                    schedules: device.schedules?.filter(
                      (schedule) => schedule.id !== scheduleId
                    ),
                  }
                : device
            )
          : []
      );
    } catch (error) {
      setError("Failed to delete schedule");
      throw error;
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        isLoading,
        error,
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

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevices must be used within a DeviceProvider");
  }
  return context;
};
