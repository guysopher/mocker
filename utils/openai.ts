import OpenAI from 'openai';
import prompts from './prompts';

// Initialize the OpenAI client with a 60-second timeout
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    timeout: 60000, // 60 seconds timeout
});

/**
 * Calls the OpenAI API to generate text completion
 * @param prompt The prompt to send to the model
 * @param options Additional options like maxTokens and model
 * @returns The generated completion
 */
export async function generateCompletion(
    prompt: string,
    options: {
        maxTokens?: number;
        model?: string;
    } = {}
) {
    try {
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                maxTokens: options.maxTokens,
                model: options.model,
            }),
            signal: AbortSignal.timeout(60000),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate completion');
        }

        return await response.json();
    } catch (error) {
        console.error('Error generating completion:', error);
        throw error;
    }
}

/**
 * Generates a detailed brief for the app based on the user's description
 */
export async function generateAppBrief(description: string, customPrompt?: string) {
    try {
        const systemPrompt = (customPrompt || prompts.brief)
            .replace('{{description}}', description);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            max_tokens: 1500,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        }, {
            timeout: 60000
        });

        if (response.choices[0]?.message?.content) {
            return JSON.parse(response.choices[0].message.content).brief;
        } else {
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('Error generating app brief:', error);
        throw error;
    }
}

/**
 * Generates user stories and features based on the app brief
 */
export async function generateUserStories(description: string, brief: string, customPrompt?: string) {
    try {
        const systemPrompt = (customPrompt || prompts.stories)
            .replace('{{description}}', description)
            .replace('{{brief}}', brief);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            max_tokens: 1000,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: `I'm creating an app with this description: "${description}"
          
          Here's the detailed brief for the app:
          ${brief}
          
          Please provide me with user stories and key features for this app. Include user personas, core functionality, and how users will interact with the app.`
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        if (response.choices[0]?.message?.content) {
            return JSON.parse(response.choices[0].message.content).stories;
        } else {
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('Error generating user stories:', error);
        throw error;
    }
}

/**
 * Generates a sitemap with a list of pages for the app
 */
export async function generateSitemap(
    description: string,
    brief: string,
    stories: string,
    customPrompt?: string
) {
    try {
        const systemPrompt = (customPrompt || prompts.sitemap)
            .replace('{{description}}', description)
            .replace('{{brief}}', brief)
            .replace('{{stories}}', stories);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            max_tokens: 15000,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: `I'm creating an app with this description: "${description}"
          
          Here's the detailed brief for the app:
          ${brief}
          
          And here are the user stories and features:
          ${stories}
          
          Please provide me with a sitemap for this app, listing all the pages that should be included.`
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        if (response.choices[0]?.message?.content) {
            return JSON.parse(response.choices[0].message.content).sitemap;
        } else {
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('Error generating sitemap:', error);
        throw error;
    }
}

/**
 * Generates layout recommendations for each page
 */
export async function generateLayout(
    description: string,
    brief: string,
    stories: string,
    page: string,
    customPrompt?: string
) {
    try {
        const systemPrompt = (customPrompt || prompts.layout)
            .replace('{{description}}', description)
            .replace('{{brief}}', brief)
            .replace('{{stories}}', stories)
            .replace('{{page}}', page);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            max_tokens: 16384,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        if (response.choices[0]?.message?.content) {
            return JSON.parse(response.choices[0].message.content);
        } else {
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('Error generating layout:', error);
        throw error;
    }
}

/**
 * Generates React code for a specific component
 */
export async function generateComponent(
    description: string,
    brief: string,
    cssClasses: string,
    page: string,
    component: string,
    customPrompt?: string
) {
    try {
        const systemPrompt = (customPrompt || prompts.component)
            .replace('{{description}}', description)
            .replace('{{brief}}', brief)
            .replace('{{cssClasses}}', cssClasses)
            .replace('{{page}}', page)
            .replace('{{component}}', component);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            max_tokens: 5000,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        if (response.choices[0]?.message?.content) {
            return JSON.parse(response.choices[0].message.content);
        } else {
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('Error generating component:', error);
        throw error;
    }
}
export async function generatePage(
    description: string,
    brief: string,
    cssClasses: string,
    page: string,
    customPrompt?: string
) {
    try {
        const systemPrompt = (customPrompt || prompts.page)
            .replace('{{description}}', description)
            .replace('{{brief}}', brief)
            .replace('{{cssClasses}}', cssClasses)
            .replace('{{page}}', page)

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            max_tokens: 16384,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        if (response.choices[0]?.message?.content) {
            return JSON.parse(response.choices[0].message.content).code;
        } else {
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('Error generating page:', error);
        throw error;
    }
}

export async function generateStylesheet(
    brief: string,
    customPrompt?: string
) {
    try {
        const systemPrompt = (customPrompt || prompts.stylesheet)
            .replace('{{brief}}', brief);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            max_tokens: 16384,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        if (response.choices[0]?.message?.content) {
            return JSON.parse(response.choices[0].message.content);
        } else {
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('Error generating stylesheet:', error);
        throw error;
    }
}