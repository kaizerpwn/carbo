import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware, validateDeviceOwnership } from "@/app/middleware";

interface AuthenticatedNextRequest extends NextRequest {
  user: {
    userId: string;
  };
}

export async function POST(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const url = new URL(req.url);
    const deviceId = url.pathname.split("/")[3];

    if (!deviceId) {
      return NextResponse.json({ error: "Invalid device ID" }, { status: 400 });
    }

    try {
      await validateDeviceOwnership(req, deviceId);

      const schedules = await req.json();
      console.log("Received schedules:", schedules);

      if (!Array.isArray(schedules) || schedules.length === 0) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const createdSchedules = await Promise.all(
        schedules.map((schedule) => {
          console.log("Creating schedule:", schedule);
          return prisma.schedule.create({
            data: {
              deviceId,
              on: schedule.on,
              off: schedule.off,
              days: Array.isArray(schedule.days) ? schedule.days.join(",") : "",
            },
          });
        })
      );

      return NextResponse.json(createdSchedules);
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      return NextResponse.json(
        { error: "Failed to create schedule" },
        { status: 500 }
      );
    }
  });
}

export async function GET(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const url = new URL(req.url);
    const deviceId = url.pathname.split("/")[3];

    if (!deviceId) {
      return NextResponse.json({ error: "Invalid device ID" }, { status: 400 });
    }

    try {
      await validateDeviceOwnership(req, deviceId);

      const schedules = await prisma.schedule.findMany({
        where: { deviceId },
      });

      return NextResponse.json(schedules);
    } catch (error: any) {
      console.error("Error fetching schedules:", error);
      return NextResponse.json(
        { error: "Failed to fetch schedules" },
        { status: 500 }
      );
    }
  });
}
