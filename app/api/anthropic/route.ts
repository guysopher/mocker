import { NextRequest, NextResponse } from 'next/server';
import prompts, { PromptName } from '@/utils/prompts';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { promptName, variables, userMessage } = await req.json();

        if (!promptName || !Object.values(PromptName).includes(promptName as PromptName)) {
            return NextResponse.json(
                { error: 'Invalid prompt name' },
                { status: 400 }
            );
        }

        // Get the prompt template
        const promptTemplate = prompts[promptName as PromptName];

        // Replace variables in the prompt template
        let systemMessage = promptTemplate;
        if (variables) {
            Object.entries(variables).forEach(([key, value]) => {
                systemMessage = systemMessage.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
            });
        }

        // Call Anthropic API with the system message and user message
        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20240620',
            system: systemMessage,
            messages: [
                { role: 'user', content: userMessage || 'Please respond based on the system instructions.' }
            ],
            max_tokens: 4000,
        });

        if (response.content[0].type === 'text') {
            return NextResponse.json({
                result: response.content[0].text
            });
        } else {
            return NextResponse.json({
                result: response.content[0]
            });
        }
    } catch (error) {
        console.error('Error in Anthropic completion route:', error);
        return NextResponse.json(
            { error: 'Failed to generate completion with Anthropic' },
            { status: 500 }
        );
    }
} 