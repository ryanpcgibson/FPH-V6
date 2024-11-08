export interface TimelineSection {
  id: string;
  items: TimelineItem[];
  patternIds: string[];
  headerStyle: string;
  onSegmentClick?: (itemId: number, momentId?: number) => void;
}

export interface LocationTimelineSegment {
  year: number;
  status:
    | "move-in"
    | "residing"
    | "move-out"
    | "memory"
    | "not-moved-in"
    | "former";
  moments?: { id: number; title: string }[];
}

export interface LocationTimeline {
  locationId: number;
  locationName: string;
  segments: LocationTimelineSegment[];
}

// TODO: store these types in the DB
// TODO: deeper analysis of pet statuses
export interface PetTimelineSegment {
  year: number;
  status:
    | "not-born"
    | "birth"
    | "alive"
    | "death"
    | "memory"
    | "deceased"
    | "transferred"
    | "adopted"
    | "lost";
  moments?: { id: number; title: string }[];
}

export interface PetTimeline {
  petId: number;
  petName: string;
  segments: PetTimelineSegment[];
}

// Base timeline types
export interface TimelineSegment {
  year: number;
  status: string;
  moments?: { id: number; title: string }[];
}

export interface TimelineItem {
  id: number;
  name: string;
  segments: TimelineSegment[];
}
