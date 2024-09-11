// src/pages/FamilyPage.tsx
import React from "react";
import { Outlet, useParams } from "react-router-dom";

const FamilyPage: React.FC = () => {
  const { familyId } = useParams<{ familyId: string }>();
  const parsedFamilyId = familyId ? parseInt(familyId, 10) : null;

  return (
    <div>
      {/* Render the matched child route with familyId as context */}
      <Outlet context={{ familyId: parsedFamilyId }} />
    </div>
  );
};

export default FamilyPage;
