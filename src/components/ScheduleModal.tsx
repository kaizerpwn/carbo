"use client";

import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { ScheduleModalProps } from "@/types/devices";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  device,
  onClose,
  onSave,
}) => {
  const [schedules, setSchedules] = useState([
    {
      id: Math.random().toString(),
      on: "08:00",
      off: "22:00",
      days: [] as string[],
    },
  ]);

  const toggleDay = (scheduleId: string, day: string) => {
    setSchedules((currentSchedules) =>
      currentSchedules.map((schedule) => {
        if (schedule.id === scheduleId) {
          return {
            ...schedule,
            days: schedule.days.includes(day)
              ? schedule.days.filter((d) => d !== day)
              : [...schedule.days, day],
          };
        }
        return schedule;
      })
    );
  };

  const addNewSchedule = () => {
    setSchedules([
      ...schedules,
      {
        id: Math.random().toString(),
        on: "08:00",
        off: "22:00",
        days: [],
      },
    ]);
  };

  const removeSchedule = (scheduleId: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== scheduleId));
  };

  const updateScheduleTime = (
    scheduleId: string,
    field: "on" | "off",
    value: string
  ) => {
    setSchedules((currentSchedules) =>
      currentSchedules.map((schedule) => {
        if (schedule.id === scheduleId) {
          return {
            ...schedule,
            [field]: value,
          };
        }
        return schedule;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    schedules.forEach((schedule) => {
      onSave(device.id, {
        on: schedule.on,
        off: schedule.off,
        days: schedule.days,
      });
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-backgroundLight rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-[#374151] sticky top-0 bg-backgroundLight">
          <div>
            <h2 className="text-white text-lg font-medium">Schedule Device</h2>
            <p className="text-[#6B7280] text-sm">{device.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {schedules.map((schedule, index) => (
            <div
              key={schedule.id}
              className="p-4 bg-[#374151] rounded-xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">Schedule {index + 1}</h3>
                {schedules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchedule(schedule.id)}
                    className="text-[#6B7280] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-white mb-1 block">
                    Turn On
                  </label>
                  <input
                    type="time"
                    value={schedule.on}
                    onChange={(e) =>
                      updateScheduleTime(schedule.id, "on", e.target.value)
                    }
                    className="w-full bg-backgroundLight rounded-lg px-3 py-2 text-white border border-[#4B5563] focus:border-[#4ADE80] focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-white mb-1 block">
                    Turn Off
                  </label>
                  <input
                    type="time"
                    value={schedule.off}
                    onChange={(e) =>
                      updateScheduleTime(schedule.id, "off", e.target.value)
                    }
                    className="w-full bg-backgroundLight rounded-lg px-3 py-2 text-white border border-[#4B5563] focus:border-[#4ADE80] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-white mb-2 block">
                  Repeat On
                </label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(schedule.id, day)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        schedule.days.includes(day)
                          ? "border-[#4ADE80] bg-[#4ADE80] bg-opacity-10 text-[#4ADE80]"
                          : "border-[#4B5563] text-[#6B7280] hover:border-[#4ADE80] hover:text-white"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addNewSchedule}
            className="w-full py-2 border-2 border-dashed border-[#4B5563] rounded-xl text-[#6B7280] hover:border-[#4ADE80] hover:text-[#4ADE80] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Schedule
          </button>

          <button
            type="submit"
            className="w-full bg-[#4ADE80] text-white py-3 rounded-xl hover:bg-[#3aa568] transition-colors"
          >
            Save Schedules
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
