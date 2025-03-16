import { NextRequest, NextResponse } from 'next/server';
import { generatePage } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const { description, brief, cssClasses, customPrompt } = await request.json();
    
    if (!description || !brief || !cssClasses) {
      return NextResponse.json(
        { error: 'Description, brief, cssClasses, and page are required' },
        { status: 400 }
      );
    }

    const code = await generatePage(
      description, 
      JSON.stringify(brief), 
      JSON.stringify(cssClasses),
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