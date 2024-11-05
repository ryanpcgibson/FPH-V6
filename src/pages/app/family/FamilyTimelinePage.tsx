import React from "react";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import TimelineBars from "@/components/TimelineBars";

const TimelinePage: React.FC = () => {
  const { petTimelines } = usePetTimelineContext();

  return (
    <div className="flex flex-row h-screen" id="page-container">
      <TimelineBars petTimelines={petTimelines} />
    </div>
  );
};

export default TimelinePage;
