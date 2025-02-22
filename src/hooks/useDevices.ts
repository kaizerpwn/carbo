import { useQuery } from "@tanstack/react-query";
import { DeviceAPI } from "@/lib/Device/Device";
import { Device } from "@/types/devices";

interface UseDevicesParams {
  userId: string;
}

interface UseDevicesReturn {
  devices: Device[];
  isLoading: boolean;
  isError: boolean;
  error: any;
}

const useDevices = ({ userId }: UseDevicesParams): UseDevicesReturn => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["devices", userId],
    queryFn: async () => {
      const devices = await DeviceAPI.getDevices(userId);
      return devices;
    },
  });

  return {
    devices: data || [],
    isLoading,
    isError,
    error,
  };
};

export default useDevices;
