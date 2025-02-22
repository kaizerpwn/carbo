"use client";

import {
  Home,
  Maximize2,
  MonitorSmartphone,
  Trophy,
  User,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface NavBarProps {
  className?: string;
}

interface MenuItem {
  icon: React.ElementType;
  route: string;
  label: string;
  onClick?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const router = useRouter();
  const currentRoute = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (route: string) => currentRoute === route;

  const mainMenuItems: MenuItem[] = [
    {
      icon: Home,
      route: "/",
      label: "Home",
      onClick: () => console.log("Home clicked"),
    },
    {
      icon: Maximize2,
      route: "/scan",
      label: "Scan",
      onClick: () => console.log("Scan clicked"),
    },
    { icon: MonitorSmartphone, route: "/devices", label: "Devices" },
    { icon: Trophy, route: "/leaderboard", label: "Leaderboard" },
  ];

  const additionalMenuItems: MenuItem[] = [
    { icon: User, route: "/profile", label: "Profile" },
    { icon: ShoppingBag, route: "/sponsor", label: "Sponsors" },
    { icon: LogOut, route: "/sign-in", label: "Logout" },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 ${
        className || ""
      }`}
    >
      <div className="bg-backgroundLight rounded-t-2xl">
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-40" : "max-h-0"
          }`}
        >
          {isMenuOpen && (
            <div className="flex justify-around items-center p-4 border-b border-gray-700">
              {additionalMenuItems.map((item) => (
                <div
                  key={item.route}
                  className={`flex flex-col items-center gap-1 cursor-pointer ${
                    isActive(item.route)
                      ? "text-primaryColor"
                      : "text-[#6B7280]"
                  }`}
                  onClick={() => {
                    router.push(item.route);
                    setIsMenuOpen(false);
                    item.onClick?.();
                  }}
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-around items-center p-5">
          {mainMenuItems.map((item) => (
            <div
              key={item.route}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                isActive(item.route) ? "text-primaryColor" : "text-[#6B7280]"
              }`}
              onClick={() => {
                router.push(item.route);
                item.onClick?.();
              }}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5" />
            </div>
          ))}

          <div
            className={`flex flex-col items-center cursor-pointer ${
              isMenuOpen ? "text-primaryColor" : "text-[#6B7280]"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center">
              <div
                className={`w-1 h-1 bg-current rounded-full mb-0.5 ${
                  isMenuOpen ? "bg-primaryColor" : ""
                }`}
              />
              <div
                className={`w-1 h-1 bg-current rounded-full mb-0.5 ${
                  isMenuOpen ? "bg-primaryColor" : ""
                }`}
              />
              <div
                className={`w-1 h-1 bg-current rounded-full ${
                  isMenuOpen ? "bg-primaryColor" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
