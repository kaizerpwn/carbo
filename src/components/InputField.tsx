import React from "react";
import { AlertCircle } from "lucide-react";

interface InputFieldProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  error,
  placeholder,
}) => (
  <div className="space-y-2">
    <label className="text-sm text-white/90 flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-backgroundDark rounded-xl p-3 text-white border
          ${error ? 'border-red-500' : 'border-white/10 focus:border-primaryColor'}
          focus:outline-none focus:ring-1 focus:ring-primaryColor/20`}
        placeholder={placeholder}
      />
      {error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
          <AlertCircle className="w-4 h-4" />
        </div>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-500 mt-1">{error}</p>
    )}
  </div>
);

export default InputField;
