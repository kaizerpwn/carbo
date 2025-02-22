import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const userProducts = await prisma.userScan.findMany({
      where: {
        userId: userId
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            brand: true,
            category: true,
            ecoScore: true,
            energyRating: true,
            carbonFootprint: true,
            recyclable: true
          }
        }
      },
      orderBy: {
        scannedAt: 'desc'
      }
    });

    const scannedProducts = userProducts.filter(scan => !scan.addedToFavorites);
    const favoriteProducts = userProducts.filter(scan => scan.addedToFavorites);

    return NextResponse.json({
      scannedProducts,
      favoriteProducts,
      total: userProducts.length,
      totalScanned: scannedProducts.length,
      totalFavorites: favoriteProducts.length
    });

  } catch (error: any) {
    console.error("Error fetching user products:", error);
    return NextResponse.json(
      { error: error?.message || "Error fetching user products" },
      { status: 500 }
    );
  }
}