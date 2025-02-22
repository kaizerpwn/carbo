import { NextRequest, NextResponse } from "next/server";

// Answers on all questions
type Answer =
  | "Never recycle"
  | "Sometimes recycle"
  | "Always recycle"
  | "Never"
  | "Sometimes"
  | "Always"
  | "Car"
  | "Bicycle"
  | "Motorcycle"
  | "Public transport"
  | "Electricity"
  | "Gas"
  | "Wood or pellets"
  | "Renewable sources";

type Question = string;

export async function POST(req: NextRequest) {
  try {
    // Checking if the request body is a valid object with questions as keys
    const requestBody = await req.json();

    if (typeof requestBody !== "object" || Array.isArray(requestBody)) {
      throw new Error("Answers are missing or in an invalid format");
    }

    const answers: Record<Question, Answer> = requestBody;

    // Scoring mapping - assigning points based on the answers
    const scoreMapping: Record<Question, Record<string, number>> = {
      "What is your most used mode of transport?": {
        Car: 0,
        Bicycle: 30,
        Motorcycle: 20,
        "Public transport": 40,
      },
      "How often do you use reusable bags instead of plastic?": {
        Never: 0,
        Sometimes: 50,
        Always: 100,
      },
      "What type of energy do you use to heat your home?": {
        Electricity: 40,
        Gas: 30,
        "Wood or pellets": 50,
        "Renewable sources": 100,
      },
      "How do you behave with recycling?": {
        "Never recycle": 0,
        "Sometimes recycle": 50,
        "Always recycle": 100,
      },
    };

    // Calculating total score
    let totalScore = 0;
    const totalMaxScore = Object.keys(scoreMapping).length * 100;

    // Iterating over answers and calculating score
    for (const [question, answer] of Object.entries(answers)) {
      if (scoreMapping[question]) {
        const score = scoreMapping[question][answer];

        if (score === undefined) {
          throw new Error(
            `Invalid answer for question: "${question}" - Answer: "${answer}"`
          );
        } else {
          totalScore += score;
        }
      } else {
        throw new Error(`Unrecognized question: "${question}"`);
      }
    }

    // Calculating the ecological awareness percentage
    const awarenessPercentage = (totalScore / totalMaxScore) * 100;

    // Assigning a nickname based on the percentage
    let nickname = "";
    if (awarenessPercentage >= 80) {
      nickname = "Green Pioneer";
    } else if (awarenessPercentage >= 60) {
      nickname = "Nature Guardian";
    } else if (awarenessPercentage >= 40) {
      nickname = "Friend of Nature";
    } else {
      nickname = "Ecologically Unaware";
    }

    return NextResponse.json({ awarenessPercentage, nickname });
  } catch (error) {
    console.error("Error processing the answers:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred while processing the data.",
      },
      { status: 500 }
    );
  }
}
