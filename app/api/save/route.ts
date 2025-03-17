import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    // Parse the JSON data from the request
    const data = await request.json();
    
    // Generate a unique filename with timestamp
    const timestamp = new Date().toISOString();
    const filename = `app-${timestamp}.json`;
    
    // Convert the data back to a JSON string for storage
      const mentalModelData = JSON.stringify(data);
    
      const options = {
          access: 'public' as const,
          // Add token option if not using environment variable
          token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN
      };

    // Create a Blob from
    //  the JSON string
    const blob = new Blob([mentalModelData], { type: 'application/json' });
    
    // Upload to Vercel Blob storage
    const { url } = await put(filename, blob, {
      access: 'public', // or 'private' depending on your needs
    });
    
    // Return the URL where the data was saved
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
