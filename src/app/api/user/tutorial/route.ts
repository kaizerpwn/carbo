import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/app/middleware";

interface AuthenticatedNextRequest extends NextRequest {
  user: {
    userId: string;
  };
}

export async function PUT(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    const { userId } = req.user;
    const { finishedTutorial } = await req.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: { finishedTutorial },
    });

    return NextResponse.json(user);
  });
}
