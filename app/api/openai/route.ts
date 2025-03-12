import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, maxTokens = 1000, model = 'gpt-4o' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    // Ensure the response is a valid JSON object
    let responseContent = response.choices[0]?.message?.content || '';
    let jsonResponse;

    try {
      // Try to parse as JSON
      jsonResponse = JSON.parse(responseContent);
    } catch (e) {
      // If not valid JSON, wrap in a JSON object
      jsonResponse = { content: responseContent };
    }

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate completion' },
      { status: 500 }
    );
  }
} 