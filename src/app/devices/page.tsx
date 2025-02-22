'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Device } from '@/types/devices';
import { DeviceCard } from '@/components/DeviceCard';
import { AddDeviceModal } from '@/components/AddDevicesModal';
import { ScheduleModal } from '@/components/ScheduleModal';
import NavBar from '@/components/NavBar';
import { useDevices } from '@/context/DeviceContext';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

export const DevicesView: React.FC = () => {
  const {
    devices,
    isLoading,
    error,
    addDevice,
    toggleDeviceStatus,
    toggleFavorite,
    updateDevice,
    deleteDevice,
    addSchedule,
  } = useDevices();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(true);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  const handleAddDevice = async (deviceData: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDevice(deviceData);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  };

  // const handleScheduleSave = (deviceId: string, schedule: any) => {};

  const handleScheduleSave = async (deviceId: string, scheduleData: any) => {
    // try {
    //   await addSchedule(deviceId, {
    //     on: scheduleData.on,
    //     off: scheduleData.off,
    //     days: scheduleData.days,
    //   });
    //  Zatvori modal nakon uspješnog dodavanja
    //   setShowScheduleModal(false);
    //   setSelectedDevice(null);
    // } catch (error) {
    //   console.error('Failed to save schedule:', error);
    //  Možda dodaj neki error handling UI
    // }
  };

  const handleEditDevice = (updatedDevice: Device) => {
    //setDevices(devices.map((device) => (device.id === updatedDevice.id ? updatedDevice : device)));
    //updateDevice("asdas", updateDevice)
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
        console.error('Failed to delete device:', error);
        // Možda dodaj neki error handling UI
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or better loading component
  }

  if (error) {
    return <div>Error: {error}</div>; // Or better error component
  }

  return (
    <div className='min-h-screen bg-backgroundDark pb-20'>
      <div className='h-2 bg-[#4ADE80] rounded-b-lg' />

      <div className='p-4 max-w-md mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-white text-xl font-bold'>My Devices</h1>
            <p className='text-[#6B7280] text-sm'>Manage your connected devices</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className='bg-[#4ADE80] p-2 rounded-full hover:bg-[#3aa568] transition-colors'
          >
            <Plus className='w-6 h-6 text-white' />
          </button>
        </div>

        <div className='space-y-6'>
          {devices.some((d) => d.isFavorite) && (
            <div>
              <h2 className='text-[#6B7280] text-sm font-medium mb-3'>Favorite Devices</h2>
              <div className='space-y-3'>
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
            <h2 className='text-[#6B7280] text-sm font-medium mb-3'>Active Devices</h2>
            <div className='space-y-3'>
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
            <h2 className='text-[#6B7280] text-sm font-medium mb-3'>Inactive Devices</h2>
            <div className='space-y-3'>
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
        <AddDeviceModal onClose={() => setShowAddModal(false)} onAdd={handleAddDevice} />
      )}

      {/* {showScheduleModal && selectedDevice && (
        <ScheduleModal
          device={selectedDevice}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedDevice(null);
          }}
          onSave={handleScheduleSave}
        />
      )} */}
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

      {showEditModal && selectedDevice && (
        // <showEditModal
        //   device={selectedDevice}
        //   onClose={() => {
        //     setShowScheduleModal(false);
        //     setSelectedDevice(null);
        //   }}
        //   onSave={handleScheduleSave}
        // />
        <></>
      )}
      <NavBar />
    </div>
  );
};

export default DevicesView;
