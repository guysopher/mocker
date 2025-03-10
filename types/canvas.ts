export interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  notes: string[];
  hasComments: boolean;
  render?: () => JSX.Element;
} 

export interface CanvasStory {
  id: string;
  title: string;
  description: string;
  acceptance: string[];
}

export interface BriefItem {
  id: string;
  title: string;
  content: string | string[];
  priority: 'low' | 'medium' | 'high';
}
