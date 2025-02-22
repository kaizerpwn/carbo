
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<Response> {
  const data = { poruka: 'Pozdrav iz GET metode u TypeScriptu!' };
  return NextResponse.json(data);
}