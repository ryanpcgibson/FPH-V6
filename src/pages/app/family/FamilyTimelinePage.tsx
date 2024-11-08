import React from "react";
import TimelineGrid from "@/components/timeline/TimelineGrid";

const FamilyTimelinePage: React.FC = () => {
  return (
    <div className="flex flex-row h-screen" id="page-container">
      <TimelineGrid />
    </div>
  );
};

export default FamilyTimelinePage;
