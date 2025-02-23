// devices.test.ts
import { GET, POST, PUT, DELETE } from "@/app/api/devices/route";
import prisma from "@/lib/prisma";
import { authMiddleware, validateDeviceOwnership } from "@/app/middleware";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  device: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/app/middleware", () => ({
  authMiddleware: jest.fn((req, callback) => callback()),
  validateDeviceOwnership: jest.fn(() => Promise.resolve()),
}));

const createMockRequest = (url: string, body?: any, failJson = false) =>
  ({
    url,
    json: failJson
      ? jest.fn().mockRejectedValue(new Error("Invalid JSON"))
      : jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest);

const createMockAuthenticatedRequest = (url: string, body?: any, failJson = false) =>
  ({
    url,
    json: failJson
      ? jest.fn().mockRejectedValue(new Error("Invalid JSON"))
      : jest.fn().mockResolvedValue(body),
    user: { userId: "testUser" },
  } as unknown as any);

describe("Devices API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /devices", () => {
    it("returns 400 if userId is missing", async () => {
      const req = createMockRequest("http://localhost/api/devices");
      const res = await GET(req);
      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.error).toBe("User ID is required");
    });

    it("returns devices if found", async () => {
      const mockDevices = [
        { id: "device1", userId: "123", powerReadings: [], schedules: [] },
      ];
      (prisma.device.findMany as jest.Mock).mockResolvedValue(mockDevices);
      const req = createMockRequest("http://localhost/api/devices?userId=123");
      const res = await GET(req);
      const data = await res.json();

      expect(prisma.device.findMany).toHaveBeenCalledWith({
        where: { userId: "123" },
        include: { powerReadings: true, schedules: true },
      });
      expect(data).toEqual(mockDevices);
    });

    it("returns 500 if prisma.device.findMany throws an error", async () => {
      (prisma.device.findMany as jest.Mock).mockRejectedValue(new Error("DB Error"));
      const req = createMockRequest("http://localhost/api/devices?userId=123");
      const res = await GET(req);
      const data = await res.json();
      expect(res.status).toBe(500);
      expect(data.error).toBe("Failed to fetch devices");
    });
  });

  describe("POST /devices", () => {
    it("returns 400 if userId or name is missing", async () => {
      const req1 = createMockRequest("http://localhost/api/devices", { name: "Device1" });
      const res1 = await POST(req1);
      const data1 = await res1.json();
      expect(res1.status).toBe(400);
      expect(data1.error).toBe("User ID and device name are required");

      const req2 = createMockRequest("http://localhost/api/devices", { userId: "123" });
      const res2 = await POST(req2);
      const data2 = await res2.json();
      expect(res2.status).toBe(400);
      expect(data2.error).toBe("User ID and device name are required");
    });

    it("creates a new device successfully", async () => {
      const deviceData = {
        userId: "123",
        name: "Device1",
        powerRating: 100,
        standbyPower: 10,
        location: "Office",
        isActive: true,
        isFavorite: false,
      };
      const createdDevice = { id: "device1", ...deviceData };
      (prisma.device.create as jest.Mock).mockResolvedValue(createdDevice);

      const req = createMockRequest("http://localhost/api/devices", deviceData);
      const res = await POST(req);
      const data = await res.json();

      expect(prisma.device.create).toHaveBeenCalledWith({
        data: {
          userId: "123",
          name: "Device1",
          powerRating: 100,
          standbyPower: 10,
          location: "Office",
          isActive: true,
          isFavorite: false,
        },
      });
      expect(data).toEqual(createdDevice);
    });

    it("returns 500 if prisma.device.create throws an error", async () => {
      (prisma.device.create as jest.Mock).mockRejectedValue(new Error("DB Error"));
      const deviceData = { userId: "123", name: "Device1" };
      const req = createMockRequest("http://localhost/api/devices", deviceData);
      const res = await POST(req);
      const data = await res.json();
      expect(res.status).toBe(500);
      expect(data.error).toBe("Failed to create device");
    });
  });

  describe("PUT /devices", () => {
    it("returns 400 if id is missing in query", async () => {
      const req = createMockAuthenticatedRequest("http://localhost/api/devices");
      const res = await PUT(req);
      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.error).toBe("Invalid ID");
    });

    it("updates a device successfully", async () => {
      const updatedData = {
        name: "Updated Device",
        powerRating: 150,
        standbyPower: 15,
        location: "Home",
        isActive: false,
      };
      const updatedDevice = { id: "device1", ...updatedData, schedules: [] };
      (prisma.device.update as jest.Mock).mockResolvedValue(updatedDevice);

      const req = createMockAuthenticatedRequest(
        "http://localhost/api/devices?id=device1",
        updatedData
      );
      const res = await PUT(req);
      const data = await res.json();

      expect(validateDeviceOwnership).toHaveBeenCalled();
      expect(prisma.device.update).toHaveBeenCalledWith({
        where: { id: "device1" },
        data: updatedData,
        include: { schedules: true },
      });
      expect(data.device).toEqual(updatedDevice);
    });

    it("returns 500 if prisma.device.update throws an error", async () => {
      (prisma.device.update as jest.Mock).mockRejectedValue(new Error("DB Error"));
      const updatedData = {
        name: "Updated Device",
        powerRating: 150,
        standbyPower: 15,
        location: "Home",
        isActive: false,
      };
      const req = createMockAuthenticatedRequest(
        "http://localhost/api/devices?id=device1",
        updatedData
      );
      const res = await PUT(req);
      const data = await res.json();
      expect(res.status).toBe(500);
      expect(data.error).toBe("Failed to update device");
    });
  });

  describe("DELETE /devices", () => {
    it("returns 400 if id is missing in query", async () => {
      const req = createMockAuthenticatedRequest("http://localhost/api/devices");
      const res = await DELETE(req);
      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.error).toBe("Invalid ID");
    });

    it("deletes a device successfully", async () => {
      (prisma.device.delete as jest.Mock).mockResolvedValue({});
      const req = createMockAuthenticatedRequest("http://localhost/api/devices?id=device1");
      const res = await DELETE(req);
      const data = await res.json();

      expect(validateDeviceOwnership).toHaveBeenCalled();
      expect(prisma.device.delete).toHaveBeenCalledWith({
        where: { id: "device1" },
      });
      expect(data).toEqual({ success: true });
    });

    it("returns 500 if prisma.device.delete throws an error", async () => {
      (prisma.device.delete as jest.Mock).mockRejectedValue(new Error("DB Error"));
      const req = createMockAuthenticatedRequest("http://localhost/api/devices?id=device1");
      const res = await DELETE(req);
      const data = await res.json();
      expect(res.status).toBe(500);
      expect(data.error).toBe("Failed to delete device");
    });
  });
});
