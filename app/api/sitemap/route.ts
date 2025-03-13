import { NextRequest, NextResponse } from 'next/server';
import { generateSitemap } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const { description, brief, stories, customPrompt } = await request.json();
    
    if (!description || !brief || !stories) {
      return NextResponse.json(
        { error: 'Description, brief, and stories are required' },
        { status: 400 }
      );
    }

    const sitemap = await generateSitemap(
      description, 
      JSON.stringify(brief), 
      JSON.stringify(stories),
      customPrompt
    );
    return NextResponse.json({ sitemap });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
} 