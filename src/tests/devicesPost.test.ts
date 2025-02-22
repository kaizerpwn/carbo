import { NextResponse } from 'next/server';
import { POST } from '@/app/api/devices/route'; // Adjust the import path as necessary
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Define the AuthenticatedNextRequest type
interface AuthenticatedNextRequest extends NextRequest {
  user: {
    userId: string;
  };
}

// Mock Prisma and authMiddleware
jest.mock('@/lib/prisma', () => ({
  device: {
    create: jest.fn(),
  },
}));
jest.mock('@/app/middleware', () => ({
  authMiddleware: jest.fn((req, callback) => callback()),
}));

describe('POST /api/devices', () => {
  it('should return a 400 error if required fields are missing', async () => {
    // Mock the request object with missing fields
    const req = {
      user: { userId: 'user1' },
      json: jest.fn().mockResolvedValue({}),
    } as unknown as AuthenticatedNextRequest;

    const response = await POST(req);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Missing required fields',
    });

    // Ensure prisma.device.create is not called
    expect(prisma.device.create).not.toHaveBeenCalled();
  });

  it('should create a device and return it with a 201 status', async () => {
    const mockDevice = {
      id: '1',
      name: 'Device 1',
      powerRating: 100,
      standbyPower: 10,
      location: 'Living Room',
      isActive: true,
      isFavorite: false,
      userId: 'user1',
      createdAt: new Date(), // Add createdAt as a Date object
      updatedAt: new Date(), // Add updatedAt as a Date object
    };

    // Mock Prisma's create to return mockDevice
    (prisma.device.create as jest.Mock).mockResolvedValue(mockDevice);

    // Mock the request object with valid fields
    const req = {
      user: { userId: 'user1' },
      json: jest.fn().mockResolvedValue({
        name: 'Device 1',
        powerRating: 100,
        standbyPower: 10,
        location: 'Living Room',
        isActive: true,
        isFavorite: false,
      }),
    } as unknown as AuthenticatedNextRequest;

    const response = await POST(req);

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      ...mockDevice,
      createdAt: mockDevice.createdAt.toISOString(), // Ensure createdAt is serialized
      updatedAt: mockDevice.updatedAt.toISOString(), // Ensure updatedAt is serialized
    });

    // Ensure prisma.device.create is called with the correct data
    expect(prisma.device.create).toHaveBeenCalledWith({
      data: {
        name: 'Device 1',
        powerRating: 100,
        standbyPower: 10,
        location: 'Living Room',
        isActive: true,
        isFavorite: false,
        userId: 'user1',
      },
    });
  });
});