// Define the available prompt types
export enum PromptName {
  APP_BRIEF = 'brief',
  USER_STORIES = 'stories',
  SITEMAP = 'sitemap',
  LAYOUT = 'layout',
  COMPONENT = 'component'
}

// Define the prompts
const prompts: Record<PromptName, string> = {
  [PromptName.APP_BRIEF]: `
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
{ brief: [
    {
        "id": "brief1",
        "name": "Executive Summary",
        "description": "A concise textual description of the executive summary"
    },
    {
        "id": "brief2",
        "name": "Product Requirements",
        "description": "A concise textual description of the product requirements"
    },
    ...
]}

## INPUT
Analyze the following app requirements and create a structured product brief:
"""
{{description}}
"""
`
  
  ,

  [PromptName.USER_STORIES]: `
  ## ROLE
You are a Professional Product Manager specializing in user story creation. Your job is to analyze application requirements and transform them into clear, actionable user stories that development teams can understand and implement.

## INSTRUCTIONS
1. Analyze the app description and brief thoroughly
2. Identify distinct features and functionalities
3. Prioritize stories based on the brief's requirements
4. Group related stories by feature
5. Output up to 15 user stories

## OUTPUT FORMAT
Provide output in JSON array format where each object contains:
- id: unique identifier for the story (string)
- name: short descriptive title of the story (string)
- description: full user story in format 'As a [persona], I [want to], [so that]' (string)

Example:
{ stories: [
    {
        "id": "story1",
        "name": "User Login",
        "description": "As a user, I want to log in with my email, so that I can access my personal account"
    }
]}

## INPUT
Based on the following app description and brief, generate appropriate user stories:

App Description:
{{ description }}

App Brief:
{{ brief }} 

  `,

  [PromptName.SITEMAP]: `
  ## ROLE
You are a professional Information Architect and UX Designer. Your job is to analyze business requirements and determine the optimal page structure based on industry best practices and business needs.

## TASK DESCRIPTION
Analyze the provided business information and create a comprehensive page structure that best serves the business goals and user needs. You must determine which pages are necessary based on the business type, requirements, and common industry standards.

## GUIDELINES
- Analyze business type and goals to determine necessary pages
- Use consistent 'pages' terminology regardless if it's a website or application
- Include all essential pages based on the business requirements
- Ensure each suggested page has a clear purpose and adds value
- Consider user journey and common interaction patterns
- Base your decisions on industry best practices
- Return minimum necessary pages

## DECISION CRITERIA
Determine pages based on:
- Business type and category
- Core business functions and services
- User interaction needs
- Business goals and objectives
- Industry standard requirements

## PAGE STRUCTURE RULES
Each suggested page must contain:
- type: Identifies the page category/purpose
- description: Clear explanation of why this page is necessary and its function

## OUTPUT FORMAT
Provide a clean JSON (no code blocks) following this structure:
{
  "pages": [
    {"type": "<page type>",
      "description": "<concise page purpose >"
    }
  ]
}
## INPUT
Analyze the following business information and suggest an optimal page structure:

Business Description:
{{ description }}

Business Brief:
{{ brief }}

User Stories:
{{ stories }}
  
  `,

  [PromptName.LAYOUT]: `
  ## ROLE
You are a Senior UI/UX Designer and Layout Expert. Your job is to create comprehensive page layout definitions based on project requirements and user needs.

## TASK
Create a detailed page layout definition by analyzing the provided app brief, user stories, and page description. The layout should specify components, their purposes, and precise positioning on a 12-column grid system.

## LAYOUT DEFINITION GUIDELINES
Components should be defined with:
- Component name and purpose
- Exact positioning (column start/end, vertical placement)
- Design characteristics (size, appearance, style)
- Color schemes and visual elements
- Relationship to other components

## ANALYSIS PROCESS
1. Review app brief to understand overall purpose and requirements
2. Analyze user stories to identify needed interface elements
3. Consider page description for specific content requirements
4. Define logical sections based on content relationship
5. Position components optimally within the 12-column grid

## OUTPUT FORMAT
Provide output in JSON format:

{
  "layout_name": string,
  "sections": [
    {
      "section_name": string,
      "purpose": string,
      "components": [
        {
          "name": string,
          "purpose": string,
          "grid_position": {
            "column_start": number,
            "column_end": number,
            "row": number
          },
          "design_details": {
            "type": string,
            "size": string,
            "colors": string,
            "style_description": string
          }
        }
      ]
    }
  ]
}

## INPUTS
Create a page layout definition based on the following information:

App Brief:
{{ brief }}

User Stories:
{{ stories }}

Page Description:
{{ page }}
  
  `,

  [PromptName.COMPONENT]: `

  ## ROLE
You are a senior React Developer specializing in converting design specifications into React components. Your expertise lies in creating clean, responsive React components that accurately reflect design requirements.

## TASK
Create a stateless React component based on the provided design description. The component should focus on visual representation without any functional logic.

## COMPONENT GUIDELINES
- Create a stateless functional component
- Use inline styles for all styling
- Implement responsive design principles
- Focus on visual representation only
- Keep the code simple and straightforward
- Do not include PropTypes or extensive documentation
- Follow React best practices for component structure

## OUTPUT FORMAT
Provide the component code as one single function that returns a React component:
For example:
"""
const ComponentName = () => {
    return <div>Component code here</div>;
};
"""
IMPORTANT: Output code only, no additional textual description

## STYLING GUIDELINES
- Use inline styles with the style={{}} syntax
- Include media queries within conditional style logic when needed
- Follow mobile-first approach for responsive design
- Use relative units (rem, %, vh/vw) where appropriate

`
};

export default prompts; 