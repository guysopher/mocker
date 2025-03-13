import { NextRequest, NextResponse } from 'next/server';
import { generateAppBrief } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const { description, customPrompt } = await request.json();
    
    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const brief = await generateAppBrief(description, customPrompt);
    return NextResponse.json({ brief });
  } catch (error) {
    console.error('Error generating brief:', error);
    return NextResponse.json(
      { error: 'Failed to generate brief', errorMessage: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 