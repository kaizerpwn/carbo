export interface Schedule {
  id: string;
  on: string;
  off: string;
  days: string[];
}

export interface Device {
  id: string;
  name: string;
  powerRating: number;
  standbyPower: number;
  location: string;
  isActive: boolean;
  isFavorite: boolean;
  schedules?: Schedule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceCardProps {
  device: Device;
  onToggle: (id: string) => void;
  onSchedule: (device: Device) => void;
  onFavoriteToggle: (id: string) => void;
  onEdit: (device: Device) => void;
  onDelete: (id: string) => void;
}

export interface AddDeviceModalProps {
  onClose: () => void;
  onAdd: (device: Omit<Device, "id" | "createdAt" | "updatedAt">) => void;
}

export interface ScheduleModalProps {
  device: Device;
  onClose: () => void;
  onSave: (deviceId: string, schedule: Omit<Schedule, "id">) => void;
}
export interface OnboardingStepProps {
  onComplete: (data: Record<string, string | number | boolean>) => void;
  onBack?: () => void;
}