import OpenAI from 'openai';

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
export async function generateAppBrief(description: string) {
  try {
    const systemPrompt = `
## ROLE
You are an experienced Product Manager specializing in SAAS products with strong technical background. Your expertise lies in analyzing raw product requirements and transforming them into structured product briefs that bridge business needs and technical implementation.
## TASK DESCRIPTION
Your task is to analyze the provided app requirements and create a structured initial product brief that will serve as a foundation for development team's work.
## ANALYSIS GUIDELINES
- Focus on identifying core functionality and key features
- Define style and UI requirements
- Offer sitemap and general structure
- The descriptions should be concise and informative
## OUTPUT STRUCTURE
The output should be organized in the following sections:
1. Executive Summary
- Product Overview
- Target User Profile
- Core Value Proposition
2. Product Requirements
   - Core Features
3. Style Guide
   - Brand Identity
     * Color Palette
     * Typography
     * Logo Usage
     * Iconography
   - UI Components
     * Buttons
     * Forms
     * Navigation Elements
     * Cards/Containers
   - Layout Guidelines
     * Grid System
     * Spacing
     * Responsive Breakpoints
4. Content Guide
- textual guidelines
- image guidelines
5. High level descriptive sitemap definition as a short paragraph.
## OUTPUT FORMAT
Provide the brief in a JSON array format following the sections defined above.
Note: The description should be a textual description (not a JSON)
For example:
{
    "brief": [
        {
            "id": "brief1",
            "name": "Executive Summary",
        "description": "A textual description of the executive summary"
    },
    {
        "id": "brief2",
        "name": "Product Requirements",
        "description": "A textual description of the product requirements"
    },
    ...
]
}
## INPUT
Analyze the following app requirements and create a structured product brief:
"""
${description}
"""
    `;
    
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
export async function generateUserStories(description: string, brief: string) {
  try {
    const systemPrompt = `## ROLE
You are a Professional Product Manager with expertise in breaking down product requirements into clear user stories. Your job is to analyze product definitions and briefs to create comprehensive user stories for development teams.
## TASK DESCRIPTION
Convert the provided app definition and project brief into well-structured user stories that capture all necessary functionality.
## USER STORY GUIDELINES
- Write stories in the format: "As a [user], I want to [action] so that [benefit]"
- Ensure each story represents a single, clear functionality
- Be specific and actionable
- Focus on user value and outcomes
- Avoid technical implementation details
## STORY ORGANIZATION
Group user stories by functionality categories such as:
- Authentication & User Management
- Core Features
- User Interface & Navigation
- Data Management
- Integration & Communication
- Settings & Preferences
## OUTPUT FORMAT
Provide output in Json Array format - make sure to include the id, name and description for each story and to return an array (even if there is only one story)
For example: 
{
    "stories": [
        {
            "id": "story1",
            "name": "User Story 1",
        "description": "..."
    },
    ...
]
}
## INPUT
Analyze the following app definition and project brief to generate comprehensive user stories:
App Definition:
"""
${description}
"""

Project Brief:
"""
${brief}
"""`;
    
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
export async function generateDesignRecommendations(description: string, brief: string, stories: string) {
  try {
    const systemPrompt = `You are an expert UI/UX designer. Your task is to create design recommendations for an app based on its description, brief, and user stories.
    
    Focus on:
    - Color schemes and typography
    - Layout and navigation structure
    - Key UI elements and components
    - Visual style and branding recommendations
    - Accessibility considerations
    
    Provide comprehensive, well-structured design recommendations that will guide the development of an intuitive and visually appealing app.
    
    Your response must be a valid JSON object with sections for different design aspects.`;
    
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