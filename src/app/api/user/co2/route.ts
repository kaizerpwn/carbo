import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const devices = await prisma.device.findMany({
      where: { userId },
      include: {
        powerReadings: true,
      },
    });

    if (!devices.length) {
      return NextResponse.json(
        { error: "No devices found for the user" },
        { status: 404 }
      );
    }

    let totalPowerConsumption = 0;
    devices.forEach((device) => {
      device.powerReadings.forEach((reading) => {
        totalPowerConsumption += Number(reading.powerConsumption);
      });
    });

    // Assuming a conversion factor for CO2 emissions (e.g., 0.000233 kg CO2 per kWh)
    const co2ConversionFactor = 0.000233;
    const carbonSaved = totalPowerConsumption * co2ConversionFactor;

    return NextResponse.json({
      carbonSaved,
    });
  } catch (error) {
    console.error("Error fetching CO2 emission data:", error);
    return NextResponse.json(
      { error: "Failed to fetch CO2 emission data" },
      { status: 500 }
    );
  }
}
