// Define the available prompt types
export enum PromptName {
    APP_BRIEF = 'brief',
    USER_STORIES = 'stories',
    SITEMAP = 'sitemap',
    STYLESHEET = 'stylesheet',
    LAYOUT = 'layout',
    COMPONENT = 'component',
    PAGE = 'page'
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
You are a UI/UX Designer and CSS Expert specializing in Ant Design (antd). Your job is to create clean, scalable, and visually stunning CSS stylesheets that extend Ant Design's components while maintaining consistency.

## TASK
Create a **CSS extension file** that builds upon Ant Design's default styles, adding additional utility classes and component-specific styles as needed.

## GUIDELINES
The stylesheet should:
- **Extend Ant Design styles rather than override them**
- Use **Ant Design class names** (e.g., '.ant - btn', '.ant - card') and apply additional styling
- **Use CSS variables** to keep styles flexible and themeable
- Maintain a **modern, clean, and elegant** look
- Ensure **responsive design**, adapting well to different screen sizes
- Use **relative units** (rem, %, vh/vw) for better scalability
- The output should be **a CSS file**, not a JSON object

### **PROCESS**
1. **Design Style Guide**  
   - Generate a **detailed overview** of the app's design language, including colors, typography, spacing, shadows, and aesthetics.
   - Define a **cohesive color palette** aligned with Ant Design's theme.
   - Provide **clear design principles** for consistency.

2. **Class List**  
   - List out all additional styles for Ant Design components.
   - Ensure styles **extend Ant Design's existing classes** (e.g., '.ant - btn - primary', '.ant - card').

3. **Ant Design Extension CSS**  
   - Write additional styles using **Ant Design's class names**.
   - Utilize **CSS variables** to make styles easily adjustable.
   - Ensure all styles are **responsive and consistent with Ant Design**.

## OUTPUT FORMAT
JSON object with the following keys:
- **overview**: A detailed description of the design language
- **classes**: An array of all additional class names (class names only)
- **stylesheet**: The actual CSS code extending Ant Design

### **Example Output**
{
    "overview": "The app should have a clean, modern, and elegant design. It should use a neutral color palette with soft blues and warm grays. Typography should be minimalistic and sans-serif. Components should have subtle shadows and rounded edges.",
    "classes": ["btn-primary", "card-shadow", "text-gradient", "custom-container"],
    "stylesheet": "@layer utilities { .btn-primary { @apply bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg transition-all duration-300 hover:bg-blue-700; } .card-shadow { @apply shadow-lg rounded-lg p-4 bg-white; } .text-gradient { background: linear-gradient(to right, #ff7eb3, #ff758c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; } .custom-container { max-width: 1200px; margin: 0 auto; padding: 1rem; } }"
}
`,
    [PromptName.LAYOUT]: `
## ROLE
You are a Senior UI/UX Designer and Layout Expert specializing in **Ant Design (antd)**. Your job is to create comprehensive **Ant Design-based page layouts** that are structured using Ant Design's recommended components and best practices.

## TASK
Create a detailed page layout definition using **Ant Design's component library** and **Grid system**. Each section of the layout should use the **appropriate Ant Design components** and define their exact placement within a **24-column Ant Design grid system**.

## LAYOUT DEFINITION GUIDELINES
Each component should be defined with:
- **Component name** (Ant Design's recommended component, e.g., 'Layout', 'Card', 'Menu', 'Button')
- **Purpose** (what it does and why it is used)
- **Exact grid positioning** (span, offset, row, col)
- **Design characteristics** (size, appearance, color schemes)
- **Relationship to other components** (how they interact)

## ANALYSIS PROCESS
1. **Review the App Brief** - Understand the purpose of the page.
2. **Analyze User Stories** - Identify key elements needed for usability.
3. **Identify Ant Design Components** - Use **only** Ant Design components that fit the design.
4. **Define Layout Structure** - Organize sections into logical components.
5. **Apply the Ant Design Grid** - Ensure all components fit within **Ant Design's 24-column grid**.
6. **Ensure No Overlaps & Proper Spacing** - Components should **not** overlap and should effectively use the grid.

### ** Important Notes**
- The layout should follow **Ant Design's 'Layout', 'Row', and 'Col' system**.
- The grid **must have 24 columns** (Ant Design standard).
- The **height should be managed by 'flex' or 'grid' properties**, depending on the use case.

## OUTPUT FORMAT
Provide output in **JSON format**:

{
    "layout_name": "string",
    "layout_description": "string",
    "components": [
        {
            "name": "string",
            "ant_design_component": "string",
            "purpose": "string",
            "detailed_description": "string",
            "grid_position": {
                "col_span": number,
                "col_offset": number,
                "row_start": number,
                "row_end": number
            }
        }
    ]
}  
`,

    [PromptName.COMPONENT]: `
## ROLE
You are a senior HTML/CSS Developer specializing in **Ant Design (antd)** components. Your expertise lies in **creating clean, responsive, and visually accurate** components using Ant Design's recommended classes and best practices.

## TASK
Create a **stateless HTML/CSS component** using **Ant Design components and classes**. The component should focus on **visual representation only**, without any functional logic.

## COMPONENT GUIDELINES
- **Use Ant Design components and class names** (e.g., 'ant-btn', 'ant-card', 'ant-modal') for styling.
- **Prefer modified global CSS classes** from the **Global CSS Classes** parameter when available.
- **Ensure all components fit the Ant Design grid system** ('Row' and 'Col' layout).
- **Follow the grid positioning** as specified in the 'grid_position' field.
- **Use semantic HTML** with 'div', 'section', and appropriate elements.
- **Ensure the component includes relevant text content** from the App Brief.

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


`,

    [PromptName.PAGE]: `
## ROLE
You are a senior React Developer specializing in **Ant Design (antd)** components. Your expertise lies in **creating clean, responsive, and visually accurate** components using Ant Design's recommended classes and best practices.

## TASK
Create a **stateless React component** using **Ant Design components and classes**. The component should focus on **visual representation only**, without any functional logic.

## COMPONENT GUIDELINES
- Use React.createElement (no JSX).
- Define the component as a stateless function using var.
- Use only antd and React as globals (no import statements or other libraries).
- Destructure antd components at the top (var { Input, Button } = antd;).
- Use inline styles (no external CSS or CSS-in-JS).
- Define event handlers as var functions inside the component.
- Use arrays and map() for rendering lists.
- Avoid modern syntax (no arrow functions, let, const, classes, or modules).

## OUTPUT FORMAT
Provide the component code as a JSON with a key "code" that contains the code as a string.
The code should define one component named "Page" that is a page.
For example:
{
    "code": "
  var { Input, Button, List, Checkbox } = antd;

  var Page = function() {
    var [tasks, setTasks] = React.useState([]);
    var [newTask, setNewTask] = React.useState("");

    var addTask = function() {
      if (newTask.trim() === "") return;
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    };

    var toggleTask = function(id) {
      setTasks(tasks.map(function(task) {
        return task.id === id ? { ...task, completed: !task.completed } : task
      }));
    };

    var deleteTask = function(id) {
      setTasks(tasks.filter(function(task) {
        return task.id !== id
      }));
    };

    return React.createElement(
      'div',
      {
        style: {
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
        }
      },
      [
        React.createElement('h2', {
          style: { textAlign: "center" },
          key: 'title'
        }, 'Todo List'),
        React.createElement(
          'div',
          {
            style: {
              display: "flex",
              gap: "8px",
              marginBottom: "16px"
            },
            key: 'input-container'
          },
          [
            React.createElement(Input, {
              value: newTask,
              onChange: function(e) { setNewTask(e.target.value) },
              placeholder: "Add a new task",
              key: 'input'
            }),
            React.createElement(Button, {
              type: "primary",
              onClick: addTask,
              key: 'add-button'
            }, 'Add')
          ]
        ),
        React.createElement(List, {
          bordered: true,
          dataSource: tasks,
          key: 'list',
          renderItem: function(task) {
            return React.createElement(List.Item, {
              key: task.id,
              actions: [
                React.createElement(Checkbox, {
                  checked: task.completed,
                  onChange: function() { toggleTask(task.id) },
                  key: 'checkbox-' + task.id
                }),
                React.createElement(Button, {
                  danger: true,
                  onClick: function() { deleteTask(task.id) },
                  key: 'delete-' + task.id
                }, 'Delete')
              ]
            }, React.createElement('span', {
              style: {
                textDecoration: task.completed ? "line-through" : "none"
              }
            }, task.text))
          }
        })
      ]
    );
  };
    ",
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

Page Layout and Components Description:
{{page}}

`
};

export default prompts; 