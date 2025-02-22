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

      if (!Array.isArray(schedules)) {
        return NextResponse.json(
          { error: "Schedules must be an array" },
          { status: 400 }
        );
      }

      await prisma.schedule.deleteMany({
        where: { deviceId },
      });

      const createdSchedules = await prisma.schedule.createMany({
        data: schedules.map((schedule) => ({
          deviceId,
          on: schedule.on,
          off: schedule.off,
          days: Array.isArray(schedule.days)
            ? schedule.days.join(",")
            : schedule.days,
        })),
      });

      const newSchedules = await prisma.schedule.findMany({
        where: { deviceId },
      });

      return NextResponse.json(newSchedules);
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      return NextResponse.json(
        {
          error: "Failed to create schedule",
          details: error.message,
        },
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

      const formattedSchedules = schedules.map((schedule) => ({
        ...schedule,
        days: schedule.days.split(","),
      }));

      return NextResponse.json(formattedSchedules);
    } catch (error: any) {
      console.error("Error fetching schedules:", error);
      return NextResponse.json(
        { error: "Failed to fetch schedules" },
        { status: 500 }
      );
    }
  });
}
