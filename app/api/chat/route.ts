import { NextRequest, NextResponse } from 'next/server';
import { generateChatMessage } from '@/utils/openai';
import prompts from '@/utils/prompts';
export async function POST(request: NextRequest) {
  try {
    const { messages, customPrompt } = await request.json();
    
    const message = await generateChatMessage(messages, customPrompt);
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error generating chat message:', error);
    return NextResponse.json(
      { error: 'Failed to generate chat message' },
      { status: 500 }
    );
  }
} 