import { NextRequest, NextResponse } from 'next/server';
import { generateSummary } from '@/utils/openai';
import prompts from '@/utils/prompts';
export async function POST(request: NextRequest) {
  try {
    const { conversation, previousDescription, customPrompt } = await request.json();
    
    const summary = await generateSummary(conversation, previousDescription, customPrompt);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
} 