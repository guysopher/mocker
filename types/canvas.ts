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
  name: string;
  description: string;
}

export interface BriefItem {
  id: string;
  name: string;
  description: string;
}
