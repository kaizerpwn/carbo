import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function sanitizeString(input: string): string {
  return input.replace(/[`]/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");
    const imageFormat = base64Image.match(/^data:image\/(\w+);base64,/);
    const format = imageFormat ? imageFormat[1] : "jpeg";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in environmental analysis. Your task is to analyze a product image. Extract all text from the image and evaluate its eco-friendliness on a scale from 1 to 100. Return your answer as a single JSON object with exactly two keys: \"text\" (a string) and \"ecofriendly_meter\" (a number). For example: { \"text\": \"Organic almond milk with recyclable packaging\", \"ecofriendly_meter\": 85 }. Do not include any extra text, explanation, or formatting. Your response must not contain markdown formatting, code blocks, or backticks.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze the following product image:" },
            {
              type: "image_url",
              image_url: { url: `data:image/${format};base64,${base64Image.replace(/^data:image\/\w+;base64,/, "")}` },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.1,
    });


    const content = response.choices[0].message.content;
    console.log(content)
    if (!content) throw new Error("No content in the response");
    let resultJSON;
    try {
      resultJSON = JSON.parse(content);
    } catch (e) {
      throw new Error("Failed to parse JSON from the first response");
    }
    if (
      typeof resultJSON.text !== "string" ||
      typeof resultJSON.ecofriendly_meter !== "number"
    ) {
      throw new Error("First response JSON missing required keys");
    }

    const ecoFactsResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in environmental analysis. Given the extracted product text, list 2 to 4 ecologically specific facts about the product, focusing on aspects like recyclable packaging, CO2 emissions, energy efficiency, or sustainable materials. Each fact must be expressed in no more than three words (e.g. 'reusable packaging', 'low CO2'). Return your answer as a single JSON object with exactly one key: \"eco_facts\", whose value is an array of strings. For example: { \"eco_facts\": [\"reusable packaging\", \"low CO2\"] }. Do not include any extra text, explanation, or formatting. Your response must not contain markdown formatting, code blocks, or backticks.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extracted product text:" },
            { type: "text", text: resultJSON.text },
          ],
        },
      ],
      max_tokens: 150,
      temperature: 0.1,
    });

    const ecoContent = ecoFactsResponse.choices[0].message.content;
    console.log(ecoContent)
    if (!ecoContent) throw new Error("No content in eco facts response");
    let ecoResult;
    try {
      ecoResult = JSON.parse(ecoContent);
    } catch (e) {
      throw new Error("Failed to parse JSON from eco facts response");
    }
    if (!Array.isArray(ecoResult.eco_facts)) {
      throw new Error("Eco facts response JSON missing 'eco_facts' key");
    }

    const sanitizedText = sanitizeString(resultJSON.text);
    const sanitizedEcoFacts = ecoResult.eco_facts.map((fact: string) =>
      sanitizeString(fact)
    );

    const finalResult = {
      text: sanitizedText,
      ecofriendly_meter: resultJSON.ecofriendly_meter,
      eco_facts: sanitizedEcoFacts,
    };

    return NextResponse.json(finalResult);
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
