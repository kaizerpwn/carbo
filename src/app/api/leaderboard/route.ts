import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "all-time";
  const locationId = searchParams.get("locationId");

  let dateFilter = {};
  if (period === "weekly") {
    dateFilter = {
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    };
  } else if (period === "monthly") {
    dateFilter = {
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    };
  }

  let locationFilter = {};
  if (locationId) {
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (location) {
      locationFilter = {
        locationId: location.id,
      };
    }
  }

  console.log("Filters:", { dateFilter, locationFilter });

  try {
    const leaderboard = await prisma.user.findMany({
      where: {
        ...dateFilter,
        ...locationFilter,
      },
      select: {
        id: true,
        fullName: true,
        userStats: {
          select: {
            totalPoints: true,
            carbonSaved: true,
          },
        },
      },
      orderBy: {
        userStats: {
          totalPoints: "desc",
        },
      },
      take: 3,
    });

    const leaderboardData = leaderboard.map((user, index) => ({
      id: user.id,
      name: user.fullName,
      points: user.userStats?.totalPoints || 0,
      co2Saved: user.userStats?.carbonSaved || 0,
      rank: index + 1,
    }));

    console.log("Leaderboard data:", leaderboardData);

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}
