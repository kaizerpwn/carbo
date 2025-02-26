import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/app/middleware";
import { Prisma } from "@prisma/client";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

function sanitizeString(input: string): string {
  return input.replace(/[`]/g, "");
}

interface AuthenticatedNextRequest extends NextRequest {
  user: {
    userId: string;
  };
}

export async function POST(req: AuthenticatedNextRequest) {
  return authMiddleware(req, async () => {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const userId = req.user.userId;

      if (!file || !userId) {
        return NextResponse.json(
          { error: "File and user ID are required" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const base64Image = Buffer.from(bytes).toString("base64");
      const imageFormat = file.type.split("/")[1] || "jpeg";

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              'You are an expert in environmental analysis. Your task is to analyze a product image. Extract all text from the image and evaluate its eco-friendliness on a scale from 1 to 100. Return your answer as a single JSON object with exactly two keys: "text" (a string) and "ecofriendly_meter" (a number). For example: { "text": "Organic almond milk with recyclable packaging", "ecofriendly_meter": 85 }. Do not include any extra text, explanation, or formatting.',
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze the following product image:" },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/${imageFormat};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.1,
      });

      const content = response.choices[0]?.message?.content;
      console.log("First response content:", content);

      if (!content) {
        return NextResponse.json(
          { error: "No content in the response" },
          { status: 500 }
        );
      }

      let resultJSON;
      try {
        resultJSON = JSON.parse(content);
      } catch (e) {
        return NextResponse.json(
          { error: "Failed to parse initial response JSON" },
          { status: 500 }
        );
      }

      if (
        !resultJSON.text ||
        typeof resultJSON.ecofriendly_meter !== "number"
      ) {
        return NextResponse.json(
          { error: "Invalid response format from initial analysis" },
          { status: 500 }
        );
      }

      const ecoFactsResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              'You are an expert in environmental analysis. Given the extracted product text, list 2 to 4 ecologically specific facts about the product, focusing on aspects like recyclable packaging, CO2 emissions, energy efficiency, or sustainable materials. Each fact must be expressed in no more than three words. Return your answer as a single JSON object with exactly one key: "eco_facts", whose value is an array of strings.',
          },
          {
            role: "user",
            content: resultJSON.text,
          },
        ],
        max_tokens: 150,
        temperature: 0.1,
      });

      const ecoContent = ecoFactsResponse.choices[0]?.message?.content;
      console.log("Eco facts response content:", ecoContent);

      if (!ecoContent) {
        return NextResponse.json(
          { error: "No content in eco facts response" },
          { status: 500 }
        );
      }

      let ecoResult;
      try {
        ecoResult = JSON.parse(ecoContent);
      } catch (e) {
        return NextResponse.json(
          { error: "Failed to parse eco facts JSON" },
          { status: 500 }
        );
      }

      if (!Array.isArray(ecoResult.eco_facts)) {
        ecoResult.eco_facts = [];
      }

      const sanitizedText = sanitizeString(resultJSON.text);
      const sanitizedEcoFacts = ecoResult.eco_facts.map((fact: string) =>
        sanitizeString(fact)
      );

      try {
        const result = await prisma.$transaction(async (tx) => {
          const user = await tx.user.findUnique({
            where: { id: userId },
          });

          if (!user) {
            throw new Error(`User with ID ${userId} not found`);
          }

          const truncatedName = sanitizedText.slice(0, 255);
          const validatedEcoScore = Math.max(
            0,
            Math.min(100, resultJSON.ecofriendly_meter)
          );

          let product = await tx.product.findFirst({
            where: { name: truncatedName },
          });

          if (!product) {
            product = await tx.product.create({
              data: {
                name: truncatedName.split(" ").slice(0, 4).join(" "),
                ecoScore: validatedEcoScore,
                category: "Unknown",
                carbonFootprint: new Prisma.Decimal(0),
                recyclable: sanitizedEcoFacts.some((fact: any) =>
                  fact.toLowerCase().includes("recycl")
                ),
                brand: null,
                energyRating: null,
              },
            });
          }

          const userScan = await tx.userScan.create({
            data: {
              userId: user.id,
              productId: product.id,
              location: "Unknown",
              addedToFavorites: false,
              scannedAt: new Date(),
            },
          });

          try {
            await tx.userStats.upsert({
              where: {
                userId: user.id,
              },
              update: {
                totalScans: { increment: 1 },
                totalPoints: { increment: 1 },
              },
              create: {
                userId: user.id,
                totalScans: 1,
                totalPoints: 1,
                carbonSaved: new Prisma.Decimal(0),
                currentStreak: 0,
                ecoProductsBought: 0,
              },
            });
          } catch (statsError) {
            console.warn("Failed to update user stats:", statsError);
          }

          return { product, userScan };
        });

        return NextResponse.json({
          text: sanitizedText,
          ecofriendly_meter: resultJSON.ecofriendly_meter,
          eco_facts: sanitizedEcoFacts,
          productId: result.product.id,
          scanId: result.userScan.id,
          success: true,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientValidationError) {
          return NextResponse.json(
            {
              error: "Validation error",
              details: "Invalid data format provided",
            },
            { status: 400 }
          );
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          switch (error.code) {
            case "P2002":
              return NextResponse.json(
                {
                  error: "Duplicate entry",
                  details: "This record already exists",
                },
                { status: 409 }
              );
            case "P2003":
              return NextResponse.json(
                {
                  error: "Invalid reference",
                  details: "Referenced record does not exist",
                },
                { status: 400 }
              );
            default:
              return NextResponse.json(
                {
                  error: "Database error",
                  details: error.message,
                },
                { status: 500 }
              );
          }
        }

        return NextResponse.json(
          {
            error: "Server error",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error processing image:", error);
      return NextResponse.json(
        { error: "Failed to process image" },
        { status: 500 }
      );
    }
  });
}
