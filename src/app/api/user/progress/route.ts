import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const totalChallenges = await prisma.userChallenge.count({
      where: { userId },
    });

    const completedChallenges = await prisma.userChallenge.count({
      where: { userId, status: "completed" },
    });

    const progress = totalChallenges
      ? (completedChallenges / totalChallenges) * 100
      : 0;

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error fetching progress data:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress data" },
      { status: 500 }
    );
  }
}
