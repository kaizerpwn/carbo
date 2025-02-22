import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const {
      email,
      password,
      username,
      fullName,
      country,
      town,
      transport,
      energy,
      recycle,
    } = await req.json();

    console.log("Parsed request body:", {
      email,
      password,
      username,
      fullName,
      country,
      town,
      transport,
      energy,
      recycle,
    });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const location = await prisma.location.create({
      data: {
        country,
        town,
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username,
        fullName,
        locationId: location.id,
        transport,
        energy,
        recycle,
      },
    });

    if (!user) {
      throw new Error("User creation failed");
    }

    await prisma.userStats.create({
      data: {
        userId: user.id,
        totalPoints: 0,
        carbonSaved: 0,
        currentStreak: 0,
        totalScans: 0,
        ecoProductsBought: 0,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
