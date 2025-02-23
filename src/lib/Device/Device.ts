import http from "../http";

export interface CreateDeviceValues {
  userId: string;
  name: string;
  location: string;
  powerRating: number;
  standbyPower: number;
  isActive: boolean;
  isFavorite: boolean;
}

export interface Schedule {
  id: string;
  on: string;
  off: string;
  days: string[];
  deviceId: string;
}

export interface UpdateDeviceValues extends Partial<CreateDeviceValues> {
  id: string;
}

let isCreatingDevice = false;
let isUpdatingDevice = false;
let isDeletingDevice = false;

export const DeviceAPI = {
  createDevice: async (values: CreateDeviceValues) => {
    if (isCreatingDevice) return;

    try {
      isCreatingDevice = true;
      const response = await http.post("/devices", values);
      return response.data;
    } finally {
      isCreatingDevice = false;
    }
  },

  getDevices: async (userId: string) => {
    const response = await http.get(`/devices?userId=${userId}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch devices");
    }
    return response.data;
  },

  getDevice: async (id: string) => {
    const response = await http.get(`/devices?id=${id}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch device");
    }
    return response.data;
  },

  updateDevice: async (values: UpdateDeviceValues) => {
    if (isUpdatingDevice) return;

    try {
      isUpdatingDevice = true;
      const response = await http.put(`/devices?id=${values.id}`, values);
      if (response.status !== 200) {
        throw new Error("Failed to update device");
      }
      return response.data;
    } finally {
      isUpdatingDevice = false;
    }
  },

  deleteDevice: async (id: string) => {
    if (isDeletingDevice) return;

    try {
      isDeletingDevice = true;
      const response = await http.delete(`/devices?id=${id}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete device");
      }
      return true;
    } finally {
      isDeletingDevice = false;
    }
  },

  toggleFavorite: async (id: string, isFavorite: boolean) => {
    const response = await http.put(`/devices/${id}/favorite`, { isFavorite });
    if (response.status !== 200) {
      throw new Error("Failed to update favorite status");
    }
    return response.data;
  },

  toggleActive: async (id: string, isActive: boolean) => {
    const response = await http.put(`/devices?id=${id}`, { isActive });
    if (response.status !== 200) {
      throw new Error("Failed to update active status");
    }
    return response.data;
  },

  addSchedule: async (
    deviceId: string,
    scheduleData: Omit<Schedule, "id" | "deviceId">
  ) => {
    try {
      const response = await http.post(
        `/devices/${deviceId}/schedules`,
        scheduleData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding schedule:", error);
      throw error;
    }
  },

  getSchedules: async (deviceId: string) => {
    try {
      const response = await http.get(`/devices/${deviceId}/schedules`);
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  },

  updateSchedule: async (
    deviceId: string,
    scheduleId: string,
    scheduleData: Partial<Schedule>
  ) => {
    try {
      const response = await http.put(
        `/devices/${deviceId}/schedules/${scheduleId}`,
        scheduleData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  },

  deleteSchedule: async (deviceId: string, scheduleId: string) => {
    try {
      await http.delete(`/devices/${deviceId}/schedules/${scheduleId}`);
      return true;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw error;
    }
  },
};
