'use client';

import {
  Home,
  Maximize2,
  MonitorSmartphone,
  Trophy,
  User,
  ShoppingBag,
  LogOut,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const NavBar = () => {
  const router = useRouter();
  const currentRoute = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (route: string) => currentRoute === route;

  const mainMenuItems = [
    { icon: Home, route: '/', label: 'Home' },
    { icon: Maximize2, route: '/scan', label: 'Scan' },
    { icon: MonitorSmartphone, route: '/devices', label: 'Devices' },
    { icon: Trophy, route: '/leaderboard', label: 'Leaderboard' },
  ];

  const additionalMenuItems = [
    { icon: User, route: '/profile', label: 'Profile' },
    { icon: ShoppingBag, route: '/sponsor', label: 'Sponsors' },
    { icon: LogOut, route: '/logout', label: 'Logout' },
  ];

  return (
    <div className='fixed bottom-0 left-0 right-0 max-w-md mx-auto'>
      <div className='bg-backgroundLight rounded-t-2xl'>
        {isMenuOpen && (
          <div className='flex justify-around items-center p-4 border-b border-gray-700'>
            {additionalMenuItems.map((item) => (
              <div
                key={item.route}
                className={`flex flex-col items-center gap-1 cursor-pointer ${
                  isActive(item.route) ? 'text-primaryColor' : 'text-[#6B7280]'
                }`}
                onClick={() => {
                  router.push(item.route);
                  setIsMenuOpen(false);
                }}
              >
                <item.icon className='w-5 h-5' />
                <span className='text-xs'>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className='flex justify-around items-center p-5'>
          {mainMenuItems.map((item) => (
            <div
              key={item.route}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                isActive(item.route) ? 'text-primaryColor' : 'text-[#6B7280]'
              }`}
              onClick={() => router.push(item.route)}
            >
              <item.icon className='w-5 h-5' />
            </div>
          ))}

          <div
            className={`flex flex-col items-center cursor-pointer ${
              isMenuOpen ? 'text-primaryColor' : 'text-[#6B7280]'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className='w-5 h-5 flex flex-col justify-center items-center'>
              <div
                className={`w-1 h-1 bg-current rounded-full mb-0.5 ${
                  isMenuOpen ? 'bg-primaryColor' : ''
                }`}
              />
              <div
                className={`w-1 h-1 bg-current rounded-full mb-0.5 ${
                  isMenuOpen ? 'bg-primaryColor' : ''
                }`}
              />
              <div
                className={`w-1 h-1 bg-current rounded-full ${isMenuOpen ? 'bg-primaryColor' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
