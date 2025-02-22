import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    // Prvi poziv: ekstrakcija teksta i ecofriendly_meter
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in environmental analysis. Given an image of a product, extract all the text present in the image and evaluate how eco-friendly the product is on a scale from 1 to 100. Return your answer as valid JSON with exactly two keys: 'text' and 'ecofriendly_meter'. Do not include any extra text or formatting.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please analyze this image:" },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.4,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content in the response");
    const resultJSON = JSON.parse(content);

    // Drugi poziv: izvuci 2-4 ekološke činjenice iz ekstraktovanog teksta
    const ecoFactsResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in environmental analysis. Given the extracted product text, list 2 to 4 ecologically specific facts about the product. Focus on aspects like recyclable packaging, CO2 emissions, energy efficiency, or sustainable materials. Return valid JSON with exactly one key: 'eco_facts' (an array of strings). Do not include any extra text or formatting.",
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
    });

    const ecoContent = ecoFactsResponse.choices[0].message.content;
    if (!ecoContent) throw new Error("No content in eco facts response");
    const ecoResult = JSON.parse(ecoContent);

    const finalResult = {
      ...resultJSON,
      eco_facts: ecoResult.eco_facts,
    };

    return NextResponse.json(finalResult);
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
