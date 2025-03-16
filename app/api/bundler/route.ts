// File: pages/api/bundle-react.js
import { bundleReactCode } from '@/utils/bundler';
import { NextRequest, NextResponse } from 'next/server';
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '2mb', // Increase limit if needed for larger code
        },
    },
    // Add runtime configuration to use Node.js runtime
    runtime: 'nodejs',
};

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
        const { code, options = {} } = await req.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json({
                error: 'Invalid request body',
                message: 'Please provide a "code" string in the request body'
            }, { status: 400 });
        }

        // Bundle the React code
        const bundledCode = await bundleReactCode(code, options);

        // Return the bundled code
        return NextResponse.json({
            success: true,
            bundledCode,
            exampleUsage: `
// HTML setup:
// <div id="react-root"></div>
// <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
// <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

// Render the bundled component:
const container = document.getElementById('react-root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Component));
      `
        }, { status: 200 });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({
            error: 'Failed to bundle React code',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}