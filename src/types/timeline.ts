export interface TimelineItem {
  id: number;
  name: string;
  segments: TimelineSegment[];
}

export interface TimelineSection {
  id: string;
  type: 'pets' | 'locations';
  items: TimelineItem[];
  patternIds: string[];
  headerStyle: string;
}

export interface TimelineSegment {
  year: number;
  status: string;
  moments?: { id: number; title: string }[];
} 