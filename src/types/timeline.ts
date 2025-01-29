export interface TimelineSection {
  id: string;
  items: TimelineItem[];
  patternIds: string[];
  headerStyle: string;
  getSegmentUrl: (baseURL: string, itemId: number, momentId?: number) => string;
}

export interface LocationTimelineSegment {
  year: number;
  status:
    | "move-in"
    | "move-in-with-memory"
    | "residing"
    | "residing-with-memory"
    | "move-out"
    | "move-out-with-memory"
    | "move-in-and-out"
    | "move-in-and-out-with-memory"
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
    | "birth"
    | "birth-and-death"
    | "birth-with-memory"
    | "birth-and-death-with-memory"
    | "alive"
    | "alive-with-memory"
    | "death"
    | "death-with-memory"
    | "memory"
    | "deceased"
    | "not-born"
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
