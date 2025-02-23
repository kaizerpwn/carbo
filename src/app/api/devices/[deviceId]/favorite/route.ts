import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware, validateDeviceOwnership } from "@/app/middleware";

interface AuthenticatedNextRequest extends NextRequest {
  user: {
    userId: string;
  };
}

export async function PUT(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const url = new URL(req.url);
    const deviceId = url.pathname.split("/")[3];

    if (!deviceId) {
      return NextResponse.json({ error: "Invalid device ID" }, { status: 400 });
    }

    try {
      await validateDeviceOwnership(req, deviceId);

      const { isFavorite } = await req.json();

      const updatedDevice = await prisma.device.update({
        where: { id: deviceId },
        data: { isFavorite },
      });

      return NextResponse.json(updatedDevice);
    } catch (error: any) {
      console.error("Error updating favorite status:", error);
      return NextResponse.json(
        { error: "Failed to update favorite status" },
        { status: 500 }
      );
    }
  });
}
