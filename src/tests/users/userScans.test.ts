import { GET } from "@/app/api/userScans/route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  userScan: {
    findMany: jest.fn(),
  },
}));

const createMockRequest = (url: string): Request => ({ url } as Request);

describe("GET /api/userProducts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if userId parameter is missing", async () => {
    const req = createMockRequest("http://localhost/api/userProducts");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Missing userId parameter");
  });

  it("returns proper data when userId is provided", async () => {
    const mockUserScans = [
      {
        id: "1",
        userId: "123",
        addedToFavorites: false,
        scannedAt: new Date(),
        product: {
          id: "p1",
          name: "Product 1",
          brand: "Brand A",
          category: "Cat 1",
          ecoScore: 80,
          energyRating: "A",
          carbonFootprint: 10.0,
          recyclable: true,
        },
      },
      {
        id: "2",
        userId: "123",
        addedToFavorites: true,
        scannedAt: new Date(),
        product: {
          id: "p2",
          name: "Product 2",
          brand: "Brand B",
          category: "Cat 2",
          ecoScore: 60,
          energyRating: "B",
          carbonFootprint: 20.0,
          recyclable: false,
        },
      },
    ];
    (prisma.userScan.findMany as jest.Mock).mockResolvedValue(mockUserScans);
    const req = createMockRequest("http://localhost/api/userProducts?userId=123");
    const res = await GET(req);
    const data = await res.json();

    expect(prisma.userScan.findMany).toHaveBeenCalledWith({
      where: { userId: "123" },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            brand: true,
            category: true,
            ecoScore: true,
            energyRating: true,
            carbonFootprint: true,
            recyclable: true,
          },
        },
      },
      orderBy: { scannedAt: "desc" },
    });

    expect(data.total).toBe(2);
    expect(data.totalScanned).toBe(1);
    expect(data.totalFavorites).toBe(1);
    expect(data.scannedProducts).toHaveLength(1);
    expect(data.favoriteProducts).toHaveLength(1);
  });

  it("returns 500 if prisma.findMany throws an error", async () => {
    (prisma.userScan.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));
    const req = createMockRequest("http://localhost/api/userProducts?userId=123");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe("Database error");
  });
});
