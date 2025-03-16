// File: pages/api/bundle-react.js
import { bundleReactCode } from '@/utils/bundler';
import { NextRequest, NextResponse } from 'next/server';

// Use the new configuration format
export const runtime = 'nodejs';

// This bodyParser config is no longer needed in App Router
// It was used in Pages Router

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
            bundledCode
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