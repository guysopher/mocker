import { NextRequest, NextResponse } from 'next/server';
import { generateComponent } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const { description, brief, page, component, customPrompt } = await request.json();
    
    if (!description || !brief || !page || !component) {
      return NextResponse.json(
        { error: 'Description, brief, page, and component are required' },
        { status: 400 }
      );
    }

    const code = await generateComponent(
      description, 
      JSON.stringify(brief), 
      JSON.stringify(page),
      JSON.stringify(component),
      customPrompt
    );
    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error generating component:', error);
    return NextResponse.json(
      { error: 'Failed to generate component' },
      { status: 500 }
    );
  }
} 