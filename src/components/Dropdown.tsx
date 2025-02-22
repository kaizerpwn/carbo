import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";

interface DropdownProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { value: string; label: string }[];
  selectedItem: string;
  onSelect: (value: string) => void;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  icon: Icon,
  items,
  selectedItem,
  onSelect,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="text-sm text-white/90 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-backgroundDark rounded-xl p-3 text-white border
            ${error ? 'border-red-500' : 'border-white/10 focus:border-primaryColor'}
            focus:outline-none focus:ring-1 focus:ring-primaryColor/20 flex justify-between items-center`}
        >
          <span>{selectedItem || "Select an option"}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-backgroundDark rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {items.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleSelect(item.value)}
                className="w-full text-left p-3 text-white hover:bg-backgroundLight"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
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
};

export default Dropdown;
