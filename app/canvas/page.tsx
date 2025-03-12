'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Canvas from '@/components/Canvas';

export default function CanvasPage() {
  const router = useRouter();
  const [appData, setAppData] = useState<{
    brief: any;
    stories: any;
    design: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Retrieve the app data from localStorage
    const storedData = localStorage.getItem('appData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setAppData(parsedData);
      } catch (error) {
        console.error('Error parsing app data:', error);
      }
    } else {
      // If no data is found, redirect back to the home page
      router.push('/');
    }
    
    setLoading(false);
  }, [router]);
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!appData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4">No app data found. Please generate an app first.</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go to App Generator
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4">
      <Canvas 
        brief={appData.brief} 
        stories={appData.stories} 
        design={appData.design} 
      />
    </div>
  );
} 