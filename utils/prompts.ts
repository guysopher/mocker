// Define the available prompt types
export enum PromptName {
    APP_BRIEF = 'brief',
    USER_STORIES = 'stories',
    SITEMAP = 'sitemap',
    STYLESHEET = 'stylesheet',
    LAYOUT = 'layout',
    COMPONENT = 'component',
    PAGE = 'page',
    CHANGE_REQUEST = 'changeRequest',
    CONTEXT = 'context'
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
The output should be organized in the following sections, where each section is a JSON object, with a title and ID:

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
Note: The description should be a textual description (not an object)

For example:
{ brief: [
    {
        "id": "brief1",
        "name": "Executive Summary",
        "description": "A concise text description of the executive summary"
    },
    {
        "id": "brief2",
        "name": "Product Requirements",
        "description": "A concise text description of the product requirements"
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
Software Architect specializing in business-aligned page structures

## TASK
Create a focused sitemap (1-5 pages) derived directly from business requirements that:
- Serves clear business goals and user needs
- Includes only essential, high-value pages
- Omits generic utility pages unless explicitly required
- Maintains consistent design across all pages

## HEADER AND FOOTER PROHIBITION
CRITICAL: Headers and footers are NOT to be included in any page design.
DO NOT generate, describe, or reference headers or footers anywhere in the output.
All pages must be designed WITHOUT headers and footers.

## LAYOUT REQUIREMENT
CRITICAL: All pages must use a consistent FULL-SCREEN layout.
Every page must utilize the entire viewport width and height.
The layout structure must be identical across all pages to maintain visual consistency.

## DESIGN SYSTEM REQUIREMENT
Establish ONE consistent design system based on the business brief with specific values for colors (HEX), font types, spacing, and component styling. This EXACT system must appear at the beginning of EVERY page's "design" field, including the full-screen layout specification.

## OUTPUT FORMAT
Return Output in JSON format
{
  "sitemap": [
    {
      "type": "Page name/type",
      "description": "Comprehensive explanation of the page's purpose, function and value to both business and users",
      "components": ["Key component 1", "Key component 2", "Key component 3"],
      "design": "Consistent design system with full-screen layout, colors, typography, spacing, and component styling (NO headers or footers)"
    }
  ]
}

## INPUT
App Brief: {{brief}}
User Stories: {{stories}}
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
Create a detailed page layout definition using **Ant Design's component library** *. Each section of the layout should use the **appropriate Ant Design components** and define their exact placement within a **24-column Ant Design grid system**.

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
6. **Ensure No Overlaps & Proper Spacing** - Components should **not** overlap and should effectively use the grid.

### ** Important Notes**
- The layout should follow **Ant Design's 'Layout', 'Row', and 'Col' system**.
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

Component Description:
{{component}}


`,

    [PromptName.PAGE]: `
## ROLE
Senior React Developer specializing in **Ant Design (antd)** components and **Tailwind CSS** with expertise in creating clean, responsive, and visually accurate components.

## TASK
Create a **stateless React component** using Ant Design components and Tailwind CSS. Focus on **visual representation only** (no functional logic). The component will be rendered on a full page (765px × 1105px) as defined by the component description.

## COMPONENT GUIDELINES
- Do not render any images - use Ant Design icons instead
- Write detailed content with realistic text that fits each UI element
- Include only the main components, no headers or footers!!!!
- Standard React component structure
- Use Tailwind CSS utility classes for styling

## MOCKUP TEXTUAL CONTENT
- Generate contextually appropriate mockup text for all content areas
- Create detailed and varied text content to make the component look authentic
- Ensure text length is appropriate for each UI element
- Use relevant placeholder text that matches the purpose of each section

## STYLING GUIDELINES
- Use Tailwind CSS utility classes for styling
- Use relative units (rem, %, vh/vw) where appropriate
- Follow grid specifications: grid is 16 columns × 9 rows
- The grid area is specified in the grid_position key (e.g., start_row 1, end_row 3, column_start 1, column_end 16 = grid area 1 / 1 / 4 / 17)


## OUTPUT FORMAT
Provide the component code as a JSON with:
1. A key "plan" that contains your plan about how to build the page and what it will include
2. A key "code" that contains the code as a string

The code should define one component named "Page" that is a page. Only include the component code, no header or footer.

Example code:

{
    "plan": "The page will include a dashboard with a statistics summary section, data visualization charts, and a recent activity table.",
    "code": "import React from 'react';
import { Layout, Row, Col, Card, Statistic, Table, Badge, Space, Tag, Progress, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined, BarChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Page = () => {
  // Mock data for statistics
  const statsData = [
    { title: 'Active Users', value: 4328, increase: 12.5, icon: <UserOutlined /> },
    { title: 'Sales', value: 1432, increase: -2.8, icon: <ShoppingCartOutlined /> },
    { title: 'Revenue', value: 9271, prefix: '$', increase: 8.1, icon: <DollarOutlined /> },
    { title: 'Conversion Rate', value: 28.3, suffix: '%', increase: 3.2, icon: <BarChartOutlined /> }
  ];

  // Mock data for table
  const tableData = [
    { key: '1', user: 'John Brown', action: 'New Purchase', amount: '$320.00', status: 'completed', time: '2 minutes ago' },
    { key: '2', user: 'Jim Green', action: 'Account Login', amount: '-', status: 'processing', time: '12 minutes ago' },
    { key: '3', user: 'Joe Black', action: 'Payment Failed', amount: '$120.50', status: 'error', time: '30 minutes ago' },
    { key: '4', user: 'Jim Red', action: 'New Subscription', amount: '$25.99', status: 'completed', time: '1 hour ago' },
    { key: '5', user: 'Jake White', action: 'Support Ticket', amount: '-', status: 'pending', time: '3 hours ago' }
  ];

  // Table columns
  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'processing') {
          color = 'blue';
        } else if (status === 'error') {
          color = 'red';
        } else if (status === 'pending') {
          color = 'orange';
        }
        return (
          <Tag color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  return (
    <Layout style={{ height: '765px', width: '1105px', padding: '1rem', background: '#f0f2f5' }}>
      <Title level={2}>Dashboard Overview</Title>
      <Text type='secondary' style={{ marginBottom: '2rem', display: 'block' }}>
        Welcome back! Here's what's happening with your business today.
      </Text>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        {statsData.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Space align='start'>
                <div style={{ fontSize: '2rem', color: '#1890ff', marginRight: '0.5rem' }}>
                  {stat.icon}
                </div>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  precision={stat.precision || 0}
                  valueStyle={{ color: stat.increase > 0 ? '#3f8600' : '#cf1322' }}
                  prefix={stat.prefix || ''}
                  suffix={stat.suffix || ''}
                />
              </Space>
              <Text
                type={stat.increase > 0 ? 'success' : 'danger'}
                style={{ display: 'block', marginTop: '0.5rem' }}
              >
                {stat.increase > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(stat.increase)}% compared to last week
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts and Progress */}
      <Row gutter={[16, 16]} style={{ marginTop: '1rem' }}>
        <Col span={12}>
          <Card title='Performance Metrics'>
            <Row>
              <Col span={12}>
                <Typography.Paragraph>Sales Targets</Typography.Paragraph>
                <Progress percent={75} status='active' />
                <Typography.Paragraph>Marketing ROI</Typography.Paragraph>
                <Progress percent={38} status='active' />
                <Typography.Paragraph>Customer Satisfaction</Typography.Paragraph>
                <Progress percent={92} status='success' />
              </Col>
              <Col span={12}>
                <Typography.Paragraph>Website Traffic</Typography.Paragraph>
                <Progress percent={68} status='active' />
                <Typography.Paragraph>Conversion Rate</Typography.Paragraph>
                <Progress percent={52} status='active' />
                <Typography.Paragraph>Support Response Time</Typography.Paragraph>
                <Progress percent={84} status='success' />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title='Activity Distribution' style={{ height: '100%' }}>
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              {/* We would normally have a chart here, but per requirements, we'll use text */}
              <Typography.Paragraph>
                Product sales distribution across categories visualized here.
              </Typography.Paragraph>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
                <div>
                  <Badge color='#1890ff' text='Electronics' />
                  <div>42%</div>
                </div>
                <div>
                  <Badge color='#52c41a' text='Clothing' />
                  <div>28%</div>
                </div>
                <div>
                  <Badge color='#faad14' text='Home' />
                  <div>18%</div>
                </div>
                <div>
                  <Badge color='#f5222d' text='Other' />
                  <div>12%</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities Table */}
      <Card title='Recent Activities' style={{ marginTop: '1rem' }}>
        <Table columns={columns} dataSource={tableData} pagination={false} />
      </Card>
    </Layout>
  );
};

export default Page;"
}

## Inputs
Create a React component based on the following information:
Component Description:
{{page}}
`,
    // This is a prefix that will be added to the end of the prompt - in case the user want to change something existing and not create a new one
    [PromptName.CHANGE_REQUEST]: `

    In the following prompt, you will receive a request to change something in the existing result.
    Change only the part of the result that the user has requested, leave the rest of the result unchanged.
    Make sure to match the context of the change request to the content you change in the result.
    Do not change the result if the change request is not clear or if it is not related to the result.

    The result could be any json - as defined by the creation prompt.

    This is the existing result:
    {{result}}

    This is the change request and context:
    {{changeRequest}}

    This is the prompt that was used to create the result, follow it to create the new result in the format it defines.
    Remember to follow the format of the result, do not change the format of the result.

    ORIGINAL PROMPT:
    -----------------
    {{prompt}}

 `,

    [PromptName.CONTEXT]: `
    ## ROLE
    You are a senior HTML analyst. Your task is to analyze the HTML code and return the element that the user is currently interacting with, and the intent it has.

    ## INSTRUCTIONS
    - Analyze the HTML code and return the element that the user is currently interacting with.
    - Find the element that the user is currently interacting with, according to the CSS path of the element.
    - Understand the request of the user.
    - Figure out the relationship between the element and the request.
    - Create a snapshot of the relevant part of the element and the intent.
    - Be as detailed as possible.

    ## OUTPUT FORMAT
 Return the element in the following JSON format:
    {
        "section": "brief | stories | sitemap | page",
        "pageName": "string",
        "element": "string",
        "snapshot": "string",
        "intent": "string"
    }

    ## EXAMPLES
    {
        "section": "brief",
        "pageName": "",
        "element": "Executive Summary",
        "snapshot": "...This app is meant for small businesses to manage their operations...",
        "intent": "The user is requesting a add a monetisation section to the Executive Summary"
    }
    {
        "section": "page",
        "pageName": "Home",
        "element": "back button",
        "snapshot": "...This button is used to go back to the previous page...",
        "intent": "The user is requesting remove the back button"
    }

    ## INPUT
    This is the HTML code of the page:
    {{html}}

    This is the CSS path of the element that the user is currently interacting with:
    {{cssPath}}

    This is the request of the user:
    {{userRequest}}

 `
};

    // Export the prompts object as the default export
    export default prompts; 