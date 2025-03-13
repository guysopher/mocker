import { NextRequest, NextResponse } from 'next/server';
import { generateLayout } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const { description, brief, stories, customPrompt } = await request.json();
    
    if (!description || !brief || !stories) {
      return NextResponse.json(
        { error: 'Description, brief, and stories are required' },
        { status: 400 }
      );
    }

    const layout = await generateLayout(
      description, 
      JSON.stringify(brief), 
      JSON.stringify(stories),
      customPrompt
    );
    return NextResponse.json({ layout });
  } catch (error) {
    console.error('Error generating layout:', error);
    return NextResponse.json(
      { error: 'Failed to generate design recommendations' },
      { status: 500 }
    );
  }
} 