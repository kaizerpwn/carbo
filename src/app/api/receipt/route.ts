import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

function sanitizeString(input: string): string {
  return input.replace(/[`]/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const productTextProvided = formData.get("productText") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!productTextProvided) {
      return NextResponse.json(
        { error: "No product text provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const responseExtract = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            'You are an expert in OCR extraction. Extract all text from the receipt image and return valid JSON with exactly one key: \'text\'. For example: { "text": "Organic almond milk bla bla bla" }. Do not include any extra text or formatting, do not use backticks or markdown formatting and dont use any characters that may not be parsable into JSON.',
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all text from the receipt image:" },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0.1,
    });

    const extractContent = responseExtract.choices[0].message.content;
    if (!extractContent) throw new Error("No content in extraction response");
    const extractResult = JSON.parse(extractContent);
    const extractedText = sanitizeString(extractResult.text);
    console.log(extractContent);

    const responseCompare = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in product ingredient comparing. Given a product description and the extracted receipt text, determine if there is any similarity between the two. Be lenient: if the receipt text at least a little bit corresponds to the product description, return true, unless there is VERY CLEAR evidence that it is not a valid purchase. Additionally, if strong similarity is not found, check if at least one ingredient or component appears in the product description that can be inside the product from the reciept; if so, consider the purchase as confirmed. Return valid JSON with exactly one key: 'confirmed' (a boolean). Make sure to use this format strictly as in example: { \"confirmed\": true }. Do not include any extra text or formatting, and do not use backticks or markdown formatting.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Product description:" },
            { type: "text", text: productTextProvided },
            { type: "text", text: "Receipt text:" },
            { type: "text", text: extractedText },
          ],
        },
      ],
      max_tokens: 100,
      temperature: 0.1,
    });

    const compareContent = responseCompare.choices[0].message.content;
    if (!compareContent) throw new Error("No content in compare response");
    const compareResult = JSON.parse(compareContent);
    const confirmed = compareResult.confirmed;
    console.log(compareContent);

    return NextResponse.json({ confirmed });
  } catch (error) {
    console.error("Error processing receipt image:", error);
    return NextResponse.json(
      { error: "Failed to process receipt image" },
      { status: 500 }
    );
  }
}
