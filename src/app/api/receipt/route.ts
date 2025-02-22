import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Funkcija za sanitizaciju stringova (uklanja backtickove)
function sanitizeString(input: string): string {
  return input.replace(/[`]/g, '');
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
      return NextResponse.json({ error: "No product text provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    // Prvi poziv: Ekstrakcija teksta sa računa
    const responseExtract = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in OCR extraction. Extract all text from the receipt image and return valid JSON with exactly one key: 'text'. Do not include any extra text or formatting, and do not use backticks or markdown formatting.",
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
    // Sanitiziramo ekstraktovani tekst
    const extractedText = sanitizeString(extractResult.text);

    // Drugi poziv: Usporedba proizvoda i računa
    const responseCompare = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in receipt analysis. Given a product description and the extracted receipt text, determine if the receipt confirms the purchase of that product. Be lenient if the receipt text is unclear. Return valid JSON with exactly one key: 'confirmed' (a boolean value). Do not include any extra text or formatting, and do not use backticks or markdown formatting.",
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

    return NextResponse.json({ confirmed });
  } catch (error) {
    console.error("Error processing receipt image:", error);
    return NextResponse.json({ error: "Failed to process receipt image" }, { status: 500 });
  }
}
