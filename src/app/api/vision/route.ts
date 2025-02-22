
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<Response> {
  const data = { poruka: 'Pozdrav iz GET metode u TypeScriptu!' };
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    // Ovde implementirajte logiku za čuvanje slike
    // Na primer, slanje na vaš backend server ili cloud storage

    // Primer slanja na eksterni API
    // const response = await fetch('YOUR_API_ENDPOINT', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.API_KEY}`
    //   },
    //   body: JSON.stringify({ image })
    // })

    // if (!response.ok) {
    //   throw new Error('Failed to upload to external API')
    // }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}