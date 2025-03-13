import OpenAI from 'openai';
import prompts from './prompts';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
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
    const systemPrompt = (customPrompt || prompts.appBrief)
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
    const systemPrompt = (customPrompt || prompts.userStories)
      .replace('{{description}}', description)
      .replace('{{brief}}', brief);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1500,
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
 * Generates design recommendations based on the app brief and user stories
 */
export async function generateDesignRecommendations(
  description: string, 
  brief: string, 
  stories: string,
  customPrompt?: string
) {
  try {
    const systemPrompt = (customPrompt || prompts.design)
      .replace('{{description}}', description)
      .replace('{{brief}}', brief)
      .replace('{{stories}}', stories);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1500,
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
          
          Please provide me with design recommendations for this app. Include color schemes, layout suggestions, key UI elements, and overall visual style.`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    if (response.choices[0]?.message?.content) {
      // Already in JSON format, no need to parse and stringify again
      return response.choices[0].message.content;
    } else {
      throw new Error('Unexpected response format from OpenAI API');
    }
  } catch (error) {
    console.error('Error generating design recommendations:', error);
    throw error;
  }
} 
