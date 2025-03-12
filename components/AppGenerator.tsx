import { useState } from 'react';

interface AppGeneratorProps {
  description: string;
  onComplete: (data: {
    brief: any;
    stories: any;
    design: string;
  }) => void;
}

export default function AppGenerator({ description, onComplete }: AppGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<any>(null);
  const [stories, setStories] = useState<any>(null);
  const [design, setDesign] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateApp = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Generate Brief
      const briefResponse = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      
      if (!briefResponse.ok) throw new Error('Failed to generate brief' + briefResponse.statusText);
      const briefData = await briefResponse.json();
      setBrief(briefData.brief);
      
      // Step 2: Generate Stories
      const storiesResponse = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description,
          brief: briefData.brief 
        }),
      });
      
      if (!storiesResponse.ok) throw new Error('Failed to generate stories');
      const storiesData = await storiesResponse.json();
      setStories(storiesData.stories);
      
      // Step 3: Generate Design
      const designResponse = await fetch('/api/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          brief: briefData.brief,
          stories: storiesData.stories
        }),
      });
      
      if (!designResponse.ok) throw new Error('Failed to generate design');
      const designData = await designResponse.json();
      setDesign(designData.design);
      
      // Notify parent component that all generation is complete
      onComplete({
        brief: briefData.brief,
        stories: storiesData.stories,
        design: designData.design
      });
    } catch (err: unknown) {
      console.error('Error generating app:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={generateApp} 
        disabled={loading}
        className="primary-button"
      >
        {loading ? 'Generating...' : 'Generate App'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="generation-status">
        <div className="status-item">
          <span>Brief:</span> 
          {loading && !brief ? 'Generating...' : brief ? 'Complete ✓' : 'Pending'}
        </div>
        <div className="status-item">
          <span>User Stories:</span> 
          {loading && brief && !stories ? 'Generating...' : stories ? 'Complete ✓' : 'Pending'}
        </div>
        <div className="status-item">
          <span>Design:</span> 
          {loading && stories && !design ? 'Generating...' : design ? 'Complete ✓' : 'Pending'}
        </div>
      </div>
    </div>
  );
} 