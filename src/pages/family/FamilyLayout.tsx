// src/pages/Layout.tsx
import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { FamilyDataProvider } from "@/context/FamilyDataContext";
import { PetTimelineProvider } from "@/context/PetTimelineContext";

const FamilyLayout: React.FC = () => {
  const { familyId: familyIdParam } = useParams<{ familyId: string }>();
  // TODO - default to first family for user
  const familyId = familyIdParam ? parseInt(familyIdParam, 10) : null;

  if (familyId === null) {
    return <div>Error: Family ID is required</div>;
  }

  return (
    <FamilyDataProvider familyId={familyId}>
      <PetTimelineProvider>
        <Outlet context={{ familyId }} />
      </PetTimelineProvider>
    </FamilyDataProvider>
  );
};

export default FamilyLayout;
