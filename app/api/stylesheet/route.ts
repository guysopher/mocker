import { NextRequest, NextResponse } from 'next/server';
import { generateStylesheet } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const { brief, customPrompt } = await request.json();
    
    if (!brief) {
      return NextResponse.json(
        { error: 'Brief is required' },
        { status: 400 }
      );
    }

    const stylesheet = await generateStylesheet(
      JSON.stringify(brief), 
      customPrompt
    );
    return NextResponse.json({ stylesheet });
  } catch (error) {
    console.error('Error generating stylesheet:', error);
    return NextResponse.json(
      { error: 'Failed to generate design recommendations' + (error as Error).message },
      { status: 500 }
    );
  }
} 