import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, temperature = 0.7 } = await request.json();
    
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }],
        model: 'meta-llama/Llama-2-7b-chat-hf',
        temperature,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Together API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ 
      content: data.choices[0].message.content 
    });
    
  } catch (error) {
    console.error('Together API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from Together AI' },
      { status: 500 }
    );
  }
}