import { GET } from "@/app/api/leaderboard/route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  location: {
    findUnique: jest.fn(),
  },
  user: {
    findMany: jest.fn(),
  },
}));

import { NextRequest } from "next/server";

const createMockRequest = (url: string): NextRequest => ({
  url,
  cookies: {},
  nextUrl: new URL(url),
  page: {},
  ua: {},
  [Symbol.for("INTERNALS")]: {},
} as unknown as NextRequest);

describe("GET /api/leaderboard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns leaderboard data for default period with no location filter", async () => {
    const mockUsers = [
      { id: "user1", fullName: "Alice", userStats: { totalPoints: 1000, carbonSaved: 50 } },
      { id: "user2", fullName: "Bob", userStats: { totalPoints: 800, carbonSaved: 40 } },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const req = createMockRequest("http://localhost/api/leaderboard");
    const res = await GET(req);
    const data = await res.json();

    expect((prisma.user.findMany as jest.Mock).mock.calls[0][0].where).toEqual({});
    expect(data).toEqual([
      { id: "user1", name: "Alice", points: 1000, co2Saved: 50, rank: 1 },
      { id: "user2", name: "Bob", points: 800, co2Saved: 40, rank: 2 },
    ]);
  });

  it("applies weekly filter when period=weekly", async () => {
    const mockUsers = [
      { id: "user1", fullName: "Alice", userStats: { totalPoints: 1100, carbonSaved: 55 } },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
    
    const req = createMockRequest("http://localhost/api/leaderboard?period=weekly");
    const res = await GET(req);
    await res.json(); 

    const calledArgs = (prisma.user.findMany as jest.Mock).mock.calls[0][0];
    expect(calledArgs.where).toHaveProperty("createdAt");
  });

  it("applies monthly filter when period=monthly", async () => {
    const mockUsers = [
      { id: "user1", fullName: "Alice", userStats: { totalPoints: 1200, carbonSaved: 60 } },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
    
    const req = createMockRequest("http://localhost/api/leaderboard?period=monthly");
    const res = await GET(req);
    await res.json();

    const calledArgs = (prisma.user.findMany as jest.Mock).mock.calls[0][0];
    expect(calledArgs.where).toHaveProperty("createdAt");
  });

  it("applies location filter if locationId is provided and found", async () => {
    (prisma.location.findUnique as jest.Mock).mockResolvedValue({ id: "loc1" });
    const mockUsers = [
      { id: "user1", fullName: "Alice", userStats: { totalPoints: 1300, carbonSaved: 65 } },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const req = createMockRequest("http://localhost/api/leaderboard?locationId=loc123");
    const res = await GET(req);
    const data = await res.json();

    expect(prisma.location.findUnique).toHaveBeenCalledWith({ where: { id: "loc123" } });
    const calledArgs = (prisma.user.findMany as jest.Mock).mock.calls[0][0];
    expect(calledArgs.where).toHaveProperty("locationId", "loc1");
    expect(data).toEqual([
      { id: "user1", name: "Alice", points: 1300, co2Saved: 65, rank: 1 },
    ]);
  });

  it("does not apply location filter if locationId is provided but not found", async () => {
    (prisma.location.findUnique as jest.Mock).mockResolvedValue(null);
    const mockUsers = [
      { id: "user1", fullName: "Alice", userStats: { totalPoints: 900, carbonSaved: 45 } },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const req = createMockRequest("http://localhost/api/leaderboard?locationId=loc123");
    const res = await GET(req);
    const data = await res.json();

    const calledArgs = (prisma.user.findMany as jest.Mock).mock.calls[0][0];
    expect(calledArgs.where).not.toHaveProperty("locationId");
    expect(data).toEqual([
      { id: "user1", name: "Alice", points: 900, co2Saved: 45, rank: 1 },
    ]);
  });

  it("returns 500 if prisma.user.findMany throws an error", async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));
    const req = createMockRequest("http://localhost/api/leaderboard");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to fetch leaderboard data");
  });
});
