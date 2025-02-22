import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware, validateDeviceOwnership } from "@/app/middleware";

interface AuthenticatedNextRequest extends NextRequest {
  user: {
    userId: string;
  };
}

export async function DELETE(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const url = new URL(req.url);
    const deviceId = url.pathname.split("/")[3];
    const scheduleId = url.pathname.split("/")[5];

    if (!deviceId || !scheduleId) {
      return NextResponse.json(
        { error: "Invalid device or schedule ID" },
        { status: 400 }
      );
    }

    try {
      await validateDeviceOwnership(req, deviceId);

      console.log(
        `Deleting schedule with ID: ${scheduleId} for device ID: ${deviceId}`
      );

      await prisma.schedule.delete({
        where: { id: scheduleId },
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      return NextResponse.json(
        { error: "Failed to delete schedule" },
        { status: 500 }
      );
    }
  });
}
