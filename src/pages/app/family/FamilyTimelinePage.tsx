import React from "react";
import FamilyTimelineGrid from "@/components/family/FamilyTimelineGrid";
import { useFamilyDataContext } from "@/context/FamilyDataContext";

const FamilyTimelinePage: React.FC = () => {
  const { error, isLoading } = useFamilyDataContext();
  if (error) {
    return <div>Error fetching family data: {error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading family data...</div>;
  }
  return (
    <div className="flex flex-row" id="page-container">
      <FamilyTimelineGrid />
    </div>
  );
};

export default FamilyTimelinePage;
