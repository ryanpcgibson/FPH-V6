// src/pages/Layout.tsx
import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { FamilyDataProvider } from "../../context/FamilyDataContext";

const FamilyPage: React.FC = () => {
  const { familyId } = useParams<{ familyId: string }>();
  // TODO - default to first family for user
  const parsedFamilyId = familyId ? parseInt(familyId, 10) : null;

  if (parsedFamilyId === null) {
    return <div>Error: Family ID is required</div>;
  }

  return (
    <FamilyDataProvider familyId={parsedFamilyId}>
      {/* Render the matched child route with familyId as context */}
      <Outlet context={{ familyId: parsedFamilyId }} />
    </FamilyDataProvider>
  );
};

export default FamilyPage;
