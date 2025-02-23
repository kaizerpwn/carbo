// updateTutorialStatus.test.ts
import { PUT } from "@/app/api/user/tutorial/route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  user: {
    update: jest.fn(),
  },
}));

// Helper to create a mock NextRequest with a json() method.
import { NextRequest } from "next/server";

const createMockRequest = (body: any, failJson = false): NextRequest => {
  return {
    json: failJson
      ? jest.fn().mockRejectedValue(new Error("Invalid JSON"))
      : jest.fn().mockResolvedValue(body),
    cookies: {},
    nextUrl: new URL("http://localhost"),
    page: {},
    ua: {},
  } as unknown as NextRequest;
};

describe("PUT /api/finishTutorial", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if userId is missing", async () => {
    const req = createMockRequest({ finishedTutorial: true });
    const res = await PUT(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("User ID is required");
  });

  it("returns the updated user when update is successful", async () => {
    const mockUser = { id: "123", finishedTutorial: true };
    (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

    const req = createMockRequest({ userId: "123", finishedTutorial: true });
    const res = await PUT(req);
    const data = await res.json();

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "123" },
      data: { finishedTutorial: true },
    });
    expect(data.user).toEqual(mockUser);
  });

  it("returns 500 if prisma.user.update throws an error", async () => {
    (prisma.user.update as jest.Mock).mockRejectedValue(new Error("Database error"));

    const req = createMockRequest({ userId: "123", finishedTutorial: false });
    const res = await PUT(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to finish tutorial");
  });
});
