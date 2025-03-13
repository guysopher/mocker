import { NextRequest, NextResponse } from 'next/server';
import { generateUserStories } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const { description, brief, customPrompt } = await request.json();
    
    if (!description || !brief) {
      return NextResponse.json(
        { error: 'Description and brief are required' },
        { status: 400 }
      );
    }

    const stories = await generateUserStories(description, JSON.stringify(brief), customPrompt);
    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Error generating stories:', error);
    return NextResponse.json(
      { error: 'Failed to generate stories' },
      { status: 500 }
    );
  }
} 