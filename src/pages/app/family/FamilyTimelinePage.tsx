import React from "react";
import FamilyTimelineGrid from "@/components/family/FamilyTimelineGrid";

const FamilyTimelinePage: React.FC = () => {
  return (
    <div className="flex flex-row h-screen" id="page-container">
      <FamilyTimelineGrid />
    </div>
  );
};

export default FamilyTimelinePage;
