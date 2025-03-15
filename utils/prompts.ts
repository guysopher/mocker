// Define the available prompt types
export enum PromptName {
    APP_BRIEF = 'brief',
    USER_STORIES = 'stories',
    SITEMAP = 'sitemap',
    STYLESHEET = 'stylesheet',
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
{{description}}

App Brief:
{{brief}} 

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
  "sitemap": [
    {"type": "<page type>",
      "description": "<concise page purpose >"
    }
  ]
}
## INPUT
Analyze the following business information and suggest an optimal page structure:

Business Description:
{{description}}

Business Brief:
{{brief}}

User Stories:
{{stories}}
  
  `,

    [PromptName.STYLESHEET]: `
    ## ROLE
You are a UI/UX Designer and CSS Expert. Your job is to create clean and effective stylesheets based on app requirements.

## TASK
Create a CSS stylesheet that reflects the app's design requirements and maintains consistency across the application.

## GUIDELINES
The stylesheet should:
- Use clear class names
- Use relative units (rem, %, vh/vw) where appropriate
- The style should be according to the design description in the App Brief.
- The design should be stunning and modern
- The design should look like a mockup, beautiful simple and clean
- Create an extensive stylesheet with all the possible classes and styles that might be needed for the components of the app. As detailed as possible.
- The stylesheet should be in the format of a css file, not a json object.

Start by creating an extensive overview of the design language the app should have. A detailed description of the colors, fonts, spacing, etc.
The overview should resemble a design style guide, fully detailed and professional.

## OUTPUT FORMAT
Json obejct with the following keys:
- overview: detailed description of the design language
- classes: array of all required classes (class names only)
- stylesheet: css code implementing the classes

## INPUT
Create a CSS stylesheet based on the following information:

App Brief:
{{brief}}

`,
    [PromptName.LAYOUT]: `
  ## ROLE
You are a Senior UI/UX Designer and Layout Expert. Your job is to create comprehensive page layout definitions based on project requirements and user needs.

## TASK
Create a detailed page layout definition by analyzing the provided app brief, user stories, and page description. The layout should specify components, their purposes, and precise positioning on a 16 columns and 9 rows grid system.

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
5. Position components optimally within the 16 columns and 9 rows grid
6. The component is rendered in a grid layout, specify the exact grid_position of the component (specific rows and columns)
7. Make sure that the components are not overlapping and fill the whole grid

Start by creating a detailed description of the layout, what it is for and what it should contain.
The layout description should include the list of components that should be included in the layout, their purpose and the way they should be positioned in the grid.
The layout description should be a detailed textual description of the layout, not a JSON object.
## OUTPUT FORMAT
Provide output in JSON format:

{
  "layout_name": string,
  "layout_description": string,
  "components": [
    {
      "name": string,
      "purpose": string,
      "detailed_description": string,
      "grid_position": {
        "column_start": number,
        "column_end": number,
        "row_start": number,
        "row_end": number
      },
    }
  ]
}

## INPUTS
Create a page layout definition based on the following information:

App Brief:
{{brief}}

User Stories:
{{stories}}

Page Description:
{{page}}
  
  `,

    [PromptName.COMPONENT]: `

  ## ROLE
You are a senior HTML/CSS Developer specializing in converting design specifications into HTML/CSS components. Your expertise lies in creating clean, responsive HTML/CSS components that accurately reflect design requirements.

## TASK
Create a stateless HTML/CSS component based on the provided design description. The component should focus on visual representation without any functional logic.

## COMPONENT GUIDELINES
- Create a stateless html/css component
- Use the global css classes provided in the CSS Classes parameter to style the component
- Focus on visual representation only
- Do not include images or icons that are not implemented in the component code
- The component is rendered in a grid layout, the position in the grid is specified in the component description (under grid_position)
- The component should inclide relevant content (text only) according to the content guide in the App Brief

## OUTPUT FORMAT
Provide the component code as a JSON with a key "html" that contains the code as a string, and a key styles that contains the parent styles for the grid position of the component.
For example:
{
    "html": "<div id='component-id'>Component that start in column 1 and row 1 and end in column 3 and row 2</div>",
    "styles": {
        "grid-area": "1 / 3 / 2 / 4"
    }
}

IMPORTANT: Output code only, no additional textual description or wrapper symbols

## STYLING GUIDELINES
- Use relative units (rem, %, vh/vw) where appropriate
- The grid area is specified in the grid_position key in the component description, remember that the grid is 16 columns and 9 rows and that the end row or column are not included in the grid area (for example: given a start_row 1 and a end_row 3, column_start 1 and column_end 16, the grid area is 1 / 1 / 4 / 17)

## INPUTS
Create a HTML/CSS component based on the following information:

App Brief:
{{brief}}

Global CSS Classes:
{{cssClasses}}

Component Description:
{{component}}


`
};

export default prompts; 