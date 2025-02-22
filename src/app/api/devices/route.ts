import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware, validateDeviceOwnership } from "@/app/middleware";

interface AuthenticatedNextRequest extends NextRequest {
  user: {
    userId: string;
  };
}

export async function GET(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const devices = await prisma.device.findMany({
      where: { userId: req.user.userId },
      include: { schedules: true }, // Include schedules in the response
    });
    return NextResponse.json({ devices });
  });
}

export async function POST(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const { name, powerRating, standbyPower, location, isActive, isFavorite } =
      await req.json();
    
    const device = await prisma.device.create({
      data: {
        name,
        powerRating,
        standbyPower,
        location,
        isActive,
        isFavorite,
        userId: req.user.userId,
      },
    });
    return NextResponse.json({ device }, { status: 201 });
  });
}

export async function PUT(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
      await validateDeviceOwnership(req, id);
      
      const { name, powerRating, standbyPower, location, isActive } = await req.json();
      
      const device = await prisma.device.update({
        where: { id: String(id) },
        data: { name, powerRating, standbyPower, location, isActive },
        include: { schedules: true }, // Include schedules in the response
      });
      
      return NextResponse.json({ device });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update device" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
      await validateDeviceOwnership(req, id);
      await prisma.device.delete({ where: { id: String(id) } });
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete device" },
        { status: 500 }
      );
    }
  });
}