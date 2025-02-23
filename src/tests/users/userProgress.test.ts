import { GET } from "@/app/api/user/progress/route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  userChallenge: {
    count: jest.fn(),
  },
}));

import { NextRequest } from "next/server";

const createMockRequest = (url: string): NextRequest => ({
  url,
  cookies: {},
  nextUrl: new URL(url),
  page: {},
  ua: {},
} as unknown as NextRequest);

describe("GET /api/getProgress", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if userId parameter is missing", async () => {
    const req = createMockRequest("http://localhost/api/getProgress");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("User ID is required");
  });

  it("returns progress correctly calculated", async () => {
    (prisma.userChallenge.count as jest.Mock)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(7);
    const req = createMockRequest("http://localhost/api/getProgress?userId=123");
    const res = await GET(req);
    const data = await res.json();

    expect(prisma.userChallenge.count).toHaveBeenNthCalledWith(1, { where: { userId: "123" } });
    expect(prisma.userChallenge.count).toHaveBeenNthCalledWith(2, { where: { userId: "123", status: "completed" } });
    expect(data.progress).toBe((7 / 10) * 100);
  });

  it("returns progress as 0 when totalChallenges is 0", async () => {
    (prisma.userChallenge.count as jest.Mock)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);
    const req = createMockRequest("http://localhost/api/getProgress?userId=123");
    const res = await GET(req);
    const data = await res.json();
    expect(data.progress).toBe(0);
  });

  it("returns 500 if prisma.count throws an error", async () => {
    (prisma.userChallenge.count as jest.Mock).mockRejectedValue(new Error("Database error"));
    const req = createMockRequest("http://localhost/api/getProgress?userId=123");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to fetch progress data");
  });
});
