import { NextRequest, NextResponse } from 'next/server';
import { generateDesignRecommendations } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const { description, brief, stories, customPrompt } = await request.json();
    
    if (!description || !brief || !stories) {
      return NextResponse.json(
        { error: 'Description, brief, and stories are required' },
        { status: 400 }
      );
    }

    const design = await generateDesignRecommendations(
      description, 
      JSON.stringify(brief), 
      JSON.stringify(stories),
      customPrompt
    );
    return NextResponse.json({ design });
  } catch (error) {
    console.error('Error generating design recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate design recommendations' },
      { status: 500 }
    );
  }
} 