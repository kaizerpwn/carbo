import { GET } from "@/app/api/user/co2/route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  device: {
    findMany: jest.fn(),
  },
}));

import { NextRequest } from "next/server";

const createMockRequest = (url: string): NextRequest => {
  return {
    url,
    cookies: {},
    nextUrl: new URL(url),
    page: {},
    ua: {},
    [Symbol.for('INTERNALS')]: {}
  } as unknown as NextRequest;
};

describe("GET /api/getCO2Data", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if userId is missing", async () => {
    const req = createMockRequest("http://localhost/api/getCO2Data");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("User ID is required");
  });

  it("returns 404 if no devices are found", async () => {
    (prisma.device.findMany as jest.Mock).mockResolvedValue([]);
    const req = createMockRequest("http://localhost/api/getCO2Data?userId=123");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.error).toBe("No devices found for the user");
  });

  it("calculates carbonSaved correctly", async () => {
    const devices = [
      {
        powerReadings: [
          { powerConsumption: "100" },
          { powerConsumption: "200" },
        ],
      },
      {
        powerReadings: [
          { powerConsumption: 50 },
        ],
      },
    ];
    (prisma.device.findMany as jest.Mock).mockResolvedValue(devices);
    const req = createMockRequest("http://localhost/api/getCO2Data?userId=123");
    const res = await GET(req);
    const data = await res.json();
    
    // Total consumption = 100 + 200 + 50 = 350
    // carbonSaved = 350 * 0.000233 = 0.08155
    expect(data.carbonSaved).toBeCloseTo(0.08155, 5);
  });

  it("returns 500 if prisma.device.findMany throws an error", async () => {
    (prisma.device.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));
    const req = createMockRequest("http://localhost/api/getCO2Data?userId=123");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to fetch CO2 emission data");
  });
});
