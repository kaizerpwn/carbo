import { NextResponse } from 'next/server';
import { GET } from '@/app/api/devices/route'; // Adjust the import path as necessary
import prisma from '@/lib/prisma';

import { NextRequest } from 'next/server';

interface AuthenticatedNextRequest extends NextRequest {
  user: {
    userId: string;
  };
}

// Mock Prisma and authMiddleware
jest.mock('@/lib/prisma', () => ({
  device: {
    findMany: jest.fn(),
  },
}));
jest.mock('@/app/middleware', () => ({
  authMiddleware: jest.fn((req, callback) => callback()),
}));

describe('GET /api/devices', () => {
  it('should return a list of devices for the authenticated user', async () => {
    const mockDevices = [
      { id: '1', name: 'Device 1', userId: 'user1' },
      { id: '2', name: 'Device 2', userId: 'user1' },
    ];

    // Mock Prisma's findMany to return mockDevices
    (prisma.device.findMany as jest.Mock).mockResolvedValue(mockDevices);

    // Mock the request object
    const req = {
      user: { userId: 'user1' },
    } as unknown as AuthenticatedNextRequest;

    const response = await GET(req);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(mockDevices);
    expect(prisma.device.findMany).toHaveBeenCalledWith({
      where: { userId: 'user1' },
    });
  });
});