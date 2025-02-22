import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { finishedTutorial, userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { finishedTutorial },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error finishing tutorial:", error);
    return NextResponse.json(
      { error: "Failed to finish tutorial" },
      { status: 500 }
    );
  }
}
