// src/pages/Layout.tsx
import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { FamilyDataProvider } from "@/context/FamilyDataContext";
import { PetTimelineProvider } from "@/context/PetTimelineContext";

const FamilyLayout: React.FC = () => {
  const { familyId } = useParams<{ familyId: string }>();
  // TODO - default to first family for user
  const parsedFamilyId = familyId ? parseInt(familyId, 10) : null;

  if (parsedFamilyId === null) {
    return <div>Error: Family ID is required</div>;
  }

  return (
    <FamilyDataProvider familyId={parsedFamilyId}>
      <PetTimelineProvider>
        <Outlet context={{ familyId: parsedFamilyId }} />
      </PetTimelineProvider>
    </FamilyDataProvider>
  );
};

export default FamilyLayout;
