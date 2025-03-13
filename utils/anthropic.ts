import Anthropic from '@anthropic-ai/sdk';
import prompts from './prompts';
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
    const systemPrompt = `
    ## ROLE
You are an experienced Product Manager specializing in SAAS products with strong technical background. Your expertise lies in analyzing raw product requirements and transforming them into structured product briefs that bridge business needs and technical implementation.
## TASK DESCRIPTION
Your task is to analyze the provided app requirements and create a structured initial product brief that will serve as a foundation for development team's work.
## ANALYSIS GUIDELINES
- Focus on identifying core functionality and key features
- Extract technical requirements and dependencies
- Identify system architecture considerations
- Maintain balance between business goals and technical feasibility
## OUTPUT STRUCTURE
The output should be organized in the following sections:
1. Executive Summary
   - Product Overview
   - Target User Profile
   - Core Value Proposition
2. Product Requirements
   - Core Features
   - Must-have Functionality
   - Nice-to-have Features
3. Technical Architecture
   - System Components
   - Data Flow
   - Third-party Dependencies
   - API Requirements
4. Development Requirements
   - Technology Stack Recommendations
   - Development Environment Setup
   - Required Services and Tools
   - Security Requirements
5. Database Structure
   - Key Entities
   - Critical Data Points
   - Data Relationships
   - Storage Requirements
6. Integration Requirements
   - External Systems
   - Authentication Methods
   - API Endpoints
   - Data Exchange Formats
7. Non-functional Requirements
   - Performance Metrics
   - Scalability Requirements
   - Security Standards
   - Compliance Requirements
8. Technical Constraints
   - Platform Limitations
   - Resource Constraints
   - Technical Debt Considerations
9. Implementation Roadmap
   - Technical Dependencies
   - Critical Path Items
   - Development Phases
10. Success Metrics
    - Performance KPIs
    - Technical Success Criteria
    - Monitoring Requirements
## INSTRUCTIONS
1. Read and analyze the input thoroughly
2. Extract key technical requirements and system needs
3. Structure the information according to the output sections
4. Focus on technical clarity and implementation guidance
5. Include specific technical details where critical
## OUTPUT FORMAT

Provide the brief in a JSON array format following the sections defined above.
The description should be a textual description (not a JSON)
For example: 
[
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

## INPUT
Analyze the following app requirements and create a structured product brief:
"""
${description}
"""
    `;
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
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
      return JSON.parse(response.content[0].text);
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
Provide output in Json Array format
For exaple: 
[
    {
        "id": "story1",
        "name": "User Story 1",
        "description": "..."
    },
    ...
]
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
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
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
      return JSON.parse(response.content[0].text);
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
      model: "claude-3-5-sonnet-latest",
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

export async function generateComponent(
    description: string,
    brief: string,
    stories: string,
    page: string,
    component: string,
    customPrompt?: string
) {
    try {
        const systemPrompt = (customPrompt || prompts.component)
            .replace('{{description}}', description)
            .replace('{{brief}}', brief)
            .replace('{{stories}}', stories)
            .replace('{{page}}', page)
            .replace('{{component}}', component);

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
            response_format: { type: "text" }
        });

        if (response.choices[0]?.message?.content) {
            return response.choices[0].message.content;
        } else {
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('Error generating component:', error);
        throw error;
    }
} 
