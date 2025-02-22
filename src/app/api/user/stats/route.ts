import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const userStats = await prisma.userStats.findUnique({
      where: { userId },
    });

    if (!userStats) {
      return NextResponse.json(
        { error: "User stats not found" },
        { status: 404 }
      );
    }

    const level = Math.floor(userStats.totalPoints / 1000);
    const nextLevelXP = (level + 1) * 1000;

    return NextResponse.json({
      totalPoints: userStats.totalPoints,
      level,
      nextLevelXP,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
