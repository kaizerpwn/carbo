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

    // Convert file to buffer and then base64
    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    // ✅ Ask OpenAI Vision API to extract text from the image
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Extract and return all the text present in the image." },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all readable text from this image." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }, // ✅ Base64 Image
          ],
        },
      ],
      max_tokens: 500,
    });

    return NextResponse.json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
