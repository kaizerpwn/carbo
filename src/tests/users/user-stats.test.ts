import { GET } from "@/app/api/user/stats/route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  userStats: {
    findUnique: jest.fn(),
  },
}));

import { NextRequest } from "next/server";

const createMockRequest = (url: string): NextRequest => {
  return {
    url,
    cookies: {},
    nextUrl: new URL(url),
    page: {},
    ua: "",
    [Symbol.for("INTERNALS")]: {},
  } as unknown as NextRequest;
};

describe("GET /api/getUserStats", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if userId parameter is missing", async () => {
    const req = createMockRequest("http://localhost/api/getUserStats");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("User ID is required");
  });

  it("returns 404 if user stats are not found", async () => {
    (prisma.userStats.findUnique as jest.Mock).mockResolvedValue(null);
    const req = createMockRequest("http://localhost/api/getUserStats?userId=123");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.error).toBe("User stats not found");
  });

  it("returns user stats with computed level and nextLevelXP", async () => {
    const mockUserStats = { totalPoints: 2500 };
    (prisma.userStats.findUnique as jest.Mock).mockResolvedValue(mockUserStats);
    const req = createMockRequest("http://localhost/api/getUserStats?userId=123");
    const res = await GET(req);
    const data = await res.json();
    // For 2500 points: level = Math.floor(2500 / 1000) = 2 and nextLevelXP = (2 + 1) * 1000 = 3000.
    expect(data.totalPoints).toBe(2500);
    expect(data.level).toBe(2);
    expect(data.nextLevelXP).toBe(3000);
  });

  it("returns 500 if prisma throws an error", async () => {
    (prisma.userStats.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"));
    const req = createMockRequest("http://localhost/api/getUserStats?userId=123");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to fetch user stats");
  });
});
