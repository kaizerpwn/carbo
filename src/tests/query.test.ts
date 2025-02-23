import { POST } from "@/app/api/query/route";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

const createMockRequest = (body: any, failJson = false) => ({
  json: failJson
    ? jest.fn().mockRejectedValue(new Error("Invalid JSON"))
    : jest.fn().mockResolvedValue(body),
  url: "http://localhost/api/ecoScore",
  cookies: {},
  nextUrl: new URL("http://localhost/api/ecoScore"),
  page: {},
  ua: "",
}) as unknown as NextRequest;

describe("POST /api/ecoScore", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns error 500 if request body is not an object", async () => {
    const req = createMockRequest([]);
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe("Answers are missing or in an invalid format");
  });

  it("returns error 500 for unrecognized question", async () => {
    const req = createMockRequest({
      "Nonexistent question": "Always",
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toMatch(/Unrecognized question/);
  });

  it("returns error 500 for an invalid answer", async () => {
    const req = createMockRequest({
      "What is your most used mode of transport?": "Scooter", // invalid answer
      "How often do you use reusable bags instead of plastic?": "Always",
      "What type of energy do you use to heat your home?": "Gas",
      "How do you behave with recycling?": "Always recycle",
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toMatch(/Invalid answer for question/);
  });

  it("calculates awareness percentage and nickname correctly for high score", async () => {
    // Answers chosen:
    // Bicycle = 30, Always = 100, Renewable sources = 100, Always recycle = 100
    // Total score = 330, max = 400, awareness = 82.5%
    const req = createMockRequest({
      "What is your most used mode of transport?": "Bicycle",
      "How often do you use reusable bags instead of plastic?": "Always",
      "What type of energy do you use to heat your home?": "Renewable sources",
      "How do you behave with recycling?": "Always recycle",
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.awarenessPercentage).toBeCloseTo(82.5, 1);
    expect(data.nickname).toBe("Green Pioneer");
  });

  it("calculates awareness percentage and nickname correctly for a lower score", async () => {
    // Answers chosen:
    // Car = 0, Never = 0, Gas = 30, Sometimes recycle = 50
    // Total score = 0 + 0 + 30 + 50 = 80, awareness = (80/400)*100 = 20%
    const req = createMockRequest({
      "What is your most used mode of transport?": "Car",
      "How often do you use reusable bags instead of plastic?": "Never",
      "What type of energy do you use to heat your home?": "Gas",
      "How do you behave with recycling?": "Sometimes recycle",
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.awarenessPercentage).toBeCloseTo(20, 1);
    expect(data.nickname).toBe("Ecologically Unaware");
  });
});
