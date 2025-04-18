import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get the timestamp from query parameters
    const url = new URL(request.url);
    const fromTimestamp = url.searchParams.get('from');
    
    // List all blobs, sorted by newest first
    const { blobs } = await list({
      limit: 1000, // We only need the most recent one
    });

    // Check if any blobs were found
    if (blobs.length === 0) {
      return NextResponse.json(
        { error: 'No saved canvases found' },
        { status: 404 }
      );
    }

    // Filter blobs by timestamp if provided
    let filteredBlobs = blobs;
    if (fromTimestamp) {
      const fromDate = new Date(fromTimestamp);
      filteredBlobs = blobs.filter(blob => new Date(blob.uploadedAt) > fromDate);
      
      if (filteredBlobs.length === 0) {
        return NextResponse.json(
          { error: 'No canvases found after the specified timestamp' },
          { status: 404 }
        );
      }
    }

    // Get the most recent blob from the filtered list
    const latestBlob = filteredBlobs[filteredBlobs.length - 1];
    
    // Fetch the actual blob content
    const blob = await fetch(latestBlob.url);
    
    if (!blob) {
      return NextResponse.json(
        { error: 'Blob content not found' },
        { status: 404 }
      );
    }
    
    // Read the blob content
    const content = await blob.json();
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching latest blob:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest canvas' },
      { status: 500 }
    );
  }
}
