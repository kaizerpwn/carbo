import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface AuthenticatedNextRequest extends NextRequest {
  user: {
    userId: string;
  };
}

import prisma from "@/lib/prisma";
import { authMiddleware, validateDeviceOwnership } from "@/app/middleware";
export async function GET(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const devices = await prisma.device.findMany({
      where: { userId: req.user.userId },
    });
    return NextResponse.json(devices);
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
    return NextResponse.json(device, { status: 201 });
  });
}
export async function PUT(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const { name, powerRating, standbyPower, location, isActive } =
      await req.json();
    if (id) {
      await validateDeviceOwnership(req, id);
    } else {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const device = await prisma.device.update({
      where: { id: String(id) },
      data: { name, powerRating, standbyPower, location, isActive },
    });
    return NextResponse.json(device);
  });
}
export async function DELETE(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (id) {
      await validateDeviceOwnership(req, id);
    } else {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    await prisma.device.delete({ where: { id: String(id) } });
    return NextResponse.json({}, { status: 204 });
  });
}
