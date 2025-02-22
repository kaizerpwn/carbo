"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, Clock, Calendar } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-backgroundLight rounded-3xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#4ADE80] p-4 relative">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-black text-lg font-medium">
                Schedule Device
              </h2>
              <p className="text-black/70 text-sm">{device.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-black/70 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {schedules.map((schedule, index) => (
            <div
              key={schedule.id}
              className="p-4 bg-backgroundDark rounded-xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#4ADE80]" />
                  <h3 className="text-white font-medium">
                    Schedule {index + 1}
                  </h3>
                </div>
                {schedules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchedule(schedule.id)}
                    className="text-[#6B7280] hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white/90 text-sm">
                    <Clock className="w-4 h-4" />
                    Turn On
                  </label>
                  <input
                    type="time"
                    value={schedule.on}
                    onChange={(e) =>
                      updateScheduleTime(schedule.id, "on", e.target.value)
                    }
                    className="w-full bg-backgroundLight rounded-xl p-3 text-white border border-white/10 focus:border-[#4ADE80] focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white/90 text-sm">
                    <Clock className="w-4 h-4" />
                    Turn Off
                  </label>
                  <input
                    type="time"
                    value={schedule.off}
                    onChange={(e) =>
                      updateScheduleTime(schedule.id, "off", e.target.value)
                    }
                    className="w-full bg-backgroundLight rounded-xl p-3 text-white border border-white/10 focus:border-[#4ADE80] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white/90 text-sm">
                  <Calendar className="w-4 h-4" />
                  Repeat On
                </label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(schedule.id, day)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        schedule.days.includes(day)
                          ? "bg-[#4ADE80] text-black font-medium"
                          : "bg-backgroundLight text-white/70 hover:text-white hover:bg-backgroundLight/80"
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
            className="w-full p-3 bg-backgroundDark rounded-xl text-white/70 hover:text-[#4ADE80] transition-colors flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add Another Schedule
          </button>

          <button
            type="submit"
            className="w-full bg-[#4ADE80] text-black font-medium p-3 rounded-xl mt-2"
          >
            Save Schedules
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
