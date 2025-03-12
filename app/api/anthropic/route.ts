import { NextRequest, NextResponse } from 'next/server';
import { generateAppContent } from '@/utils/anthropic';

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();
    
    if (!description) {
      return NextResponse.json(
        { error: 'App description is required' },
        { status: 400 }
      );
    }

    // Generate all content in sequence
    const content = await generateAppContent(description);
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate app content' },
      { status: 500 }
    );
  }
} 