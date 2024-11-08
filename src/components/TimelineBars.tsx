// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { usePetTimelineContext } from "@/context/PetTimelineContext";
// import { useLocationTimelineContext } from "@/context/LocationTimelineContext";
// import TimelineGrid from "./timeline/TimelineGrid";
// import { useTimelineSections } from "@/hooks/useTimelineSections";

// interface TimelineBarsProps {
//   petId?: number;
//   className?: string;
// }

// const TimelineBars: React.FC<TimelineBarsProps> = ({ petId }) => {
//   const { petTimelines } = usePetTimelineContext();
//   const { locationTimelines } = useLocationTimelineContext();
//   const navigate = useNavigate();

//   const sections = useTimelineSections({
//     petTimelines,
//     locationTimelines,
//     petId,
//   });

//   const handleSegmentClick = (itemId: number, momentId?: number) => {
//     if (momentId) {
//       navigate(`/pet/${itemId}`, { state: { momentId } });
//     }
//   };

//   return (
//     <TimelineGrid sections={sections} onSegmentClick={handleSegmentClick} />
//   );
// };

// export default TimelineBars;
