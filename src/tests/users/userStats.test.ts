import { POST } from "@/app/api/userStats/route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  userStats: {
    upsert: jest.fn(),
  },
}));

const createMockRequest = (body: any, failJson = false): Request => {
  return {
    json: failJson
      ? jest.fn().mockRejectedValue(new Error("Invalid JSON"))
      : jest.fn().mockResolvedValue(body),
  } as unknown as Request;
};

describe("POST /api/userStats", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = createMockRequest(null, true);
    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid JSON body");
  });

  it("returns 400 when missing userId", async () => {
    const req = createMockRequest({ coins: 10 });
    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing userId or coins in request body");
  });

  it("returns 400 when missing coins", async () => {
    const req = createMockRequest({ userId: "123" });
    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing userId or coins in request body");
  });

  it("returns success when update succeeds", async () => {
    (prisma.userStats.upsert as jest.Mock).mockResolvedValue({});
    const req = createMockRequest({ userId: "123", coins: 10 });
    const response = await POST(req);
    const data = await response.json();

    expect(prisma.userStats.upsert).toHaveBeenCalledWith({
      where: { userId: "123" },
      update: { totalCoins: { increment: 10 } },
      create: {
        userId: "123",
        totalCoins: 10,
        carbonSaved: 0.0,
        currentStreak: 0,
        totalScans: 0,
        ecoProductsBought: 0,
      },
    });
    expect(response.status).toBe(200);
    expect(data.message).toBe("User stats updated successfully");
  });

  it("returns 500 when prisma.upsert throws an error", async () => {
    (prisma.userStats.upsert as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );
    const req = createMockRequest({ userId: "123", coins: 10 });
    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data.error).toBe("Database error");
  });
});
