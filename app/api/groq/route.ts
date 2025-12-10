import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Check authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { message, temperature = 0.7 } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set');
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured on the server' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }],
        // Updated to a currently supported Groq Llama 3 model
        model: 'llama-3.1-8b-instant',
        temperature,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Groq API non-OK:', response.status, errorBody);
      return NextResponse.json(
        { error: `Groq API error: ${response.status} ${response.statusText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      content: data.choices[0]?.message?.content ?? '',
    });

  } catch (error) {
    console.error('Groq API Error (catch):', error);
    return NextResponse.json(
      { error: 'Failed to get response from Groq' },
      { status: 500 }
    );
  }
}