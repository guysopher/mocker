import { NextRequest, NextResponse } from 'next/server';
import { generatePage } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const { brief, page, customPrompt } = await request.json();
    
    if (!brief || !page) {
      return NextResponse.json(
        { error: 'Brief, and page are required' },
        { status: 400 }
      );
    }

    const code = await generatePage(
      JSON.stringify(brief), 
      JSON.stringify(page),
      customPrompt
    );
    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error generating page:', error);
    return NextResponse.json(
      { error: 'Failed to generate page' },
      { status: 500 }
    );
  }
} 