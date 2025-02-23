import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (e: any) {
    console.error("Error parsing request body:", e);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { userId, coins } = body || {};
  if (!userId || coins === undefined) {
    return NextResponse.json(
      { error: "Missing userId or coins in request body" },
      { status: 400 }
    );
  }

  try {
    await prisma.userStats.upsert({
      where: { userId },
      update: { totalCoins: { increment: coins } },
      create: {
        userId,
        totalCoins: coins,
        carbonSaved: 0.0,
        currentStreak: 0,
        totalScans: 0,
        ecoProductsBought: 0,
      },
    });

    return NextResponse.json({ message: "User stats updated successfully" });
  } catch (error: any) {
    console.error("Error updating user stats:", error);
    return NextResponse.json(
      { error: error?.message || "Error updating user stats" },
      { status: 500 }
    );
  }
}
