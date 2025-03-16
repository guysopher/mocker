import { NextRequest, NextResponse } from 'next/server';
import { generateChangeRequest } from '@/utils/openai';
import prompts from '@/utils/prompts';
export async function POST(request: NextRequest) {
  try {
    const { result, changeRequest, section, customPrompt, ...promptParams } = await request.json();
    
    const {change, prompt: changePrompt} = await generateChangeRequest(
      JSON.stringify(result), 
      changeRequest, 
      prompts[section as keyof typeof prompts],
      promptParams,
      customPrompt
    );
    return NextResponse.json({ change, changePrompt });
  } catch (error) {
    console.error('Error generating component:', error);
    return NextResponse.json(
      { error: 'Failed to generate component' },
      { status: 500 }
    );
  }
} 