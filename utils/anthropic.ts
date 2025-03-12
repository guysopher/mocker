import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Calls the Anthropic API to generate text completion
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
    const response = await fetch('/api/anthropic', {
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
export async function generateAppBrief(description: string) {
  try {
    const systemPrompt = `You are an expert app designer and product strategist. Your task is to create a detailed brief for an app based on a user's description.
    
    Focus on:
    - Core purpose and value proposition
    - Target audience
    - Key problems the app solves
    - Market positioning
    - Overall vision and goals
    
    Provide a comprehensive, well-structured brief that clearly articulates the app concept.`;
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `I want to create an app with the following description: "${description}"
          
          Please provide me with a detailed brief of the app concept that includes the core purpose, target audience, key problems it solves, and overall vision.`
        }
      ],
      temperature: 0.7,
    });

    if (response.content[0].type === 'text') {
      return response.content[0].text;
    } else {
      throw new Error('Unexpected response format from Anthropic API');
    }
  } catch (error) {
    console.error('Error generating app brief:', error);
    throw error;
  }
}

/**
 * Generates user stories and features based on the app brief
 */
export async function generateUserStories(description: string, brief: string) {
  try {
    const systemPrompt = `You are an expert product manager and UX designer. Your task is to create user stories and define key features for an app based on its description and brief.
    
    Focus on:
    - User personas and their needs
    - User journeys and flows
    - Core features and functionality
    - Prioritization of features (must-have vs nice-to-have)
    - Success metrics for each feature
    
    Provide comprehensive, well-structured user stories that clearly articulate how users will interact with the app.`;
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `I'm creating an app with this description: "${description}"
          
          Here's the detailed brief for the app:
          ${brief}
          
          Please provide me with user stories and key features for this app. Include user personas, core functionality, and how users will interact with the app.`
        }
      ],
      temperature: 0.7,
    });

    if (response.content[0].type === 'text') {
      return response.content[0].text;
    } else {
      throw new Error('Unexpected response format from Anthropic API');
    }
  } catch (error) {
    console.error('Error generating user stories:', error);
    throw error;
  }
}

/**
 * Generates design recommendations based on the app brief and user stories
 */
export async function generateDesignRecommendations(description: string, brief: string, stories: string) {
  try {
    const systemPrompt = `You are an expert UI/UX designer. Your task is to create design recommendations for an app based on its description, brief, and user stories.
    
    Focus on:
    - Color schemes and typography
    - Layout and navigation structure
    - Key UI elements and components
    - Visual style and branding recommendations
    - Accessibility considerations
    
    Provide comprehensive, well-structured design recommendations that will guide the development of an intuitive and visually appealing app.`;
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
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
    });

    if (response.content[0].type === 'text') {
      return response.content[0].text;
    } else {
      throw new Error('Unexpected response format from Anthropic API');
    }
  } catch (error) {
    console.error('Error generating design recommendations:', error);
    throw error;
  }
}

/**
 * Orchestrates the generation of all app content in sequence
 */
export async function generateAppContent(description: string) {
  try {
    // Step 1: Generate the app brief
    const brief = await generateAppBrief(description);
    
    // Step 2: Generate user stories based on the brief
    const stories = await generateUserStories(description, brief);
    
    // Step 3: Generate design recommendations based on brief and stories
    const design = await generateDesignRecommendations(description, brief, stories);
    
    // Return all content
    return {
      brief,
      stories,
      design
    };
  } catch (error) {
    console.error('Error generating app content:', error);
    throw error;
  }
} 