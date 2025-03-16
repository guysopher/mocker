import { NextRequest, NextResponse } from 'next/server';
import { getContext } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const { html, cssPath, userRequest } = await request.json();
    
    const context = await getContext(
      html, 
      cssPath, 
      userRequest
    );
    return NextResponse.json({ context });
  } catch (error) {
    console.error('Error generating context:', error);
    return NextResponse.json(
      { error: 'Failed to generate context' },
      { status: 500 }
    );
  }
} 