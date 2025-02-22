"use client";

import React from "react";
import { X } from "lucide-react";

interface DeleteConfirmationModalProps {
  deviceName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({ deviceName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-backgroundLight rounded-3xl w-full max-w-sm overflow-hidden">
        <div className="bg-[#4ADE80] p-4 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-black text-lg font-medium">Delete Device</h2>
            <button
              onClick={onCancel}
              className="text-black/70 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-white">
            Are you sure you want to delete the device{" "}
            <strong>{deviceName}</strong>?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="bg-backgroundDark text-white py-2 px-4 rounded-lg hover:bg-backgroundLight transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
