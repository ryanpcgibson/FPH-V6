import React from "react";
import { Outlet, useParams, Navigate, useLocation } from "react-router-dom";
import { FamilyDataProvider } from "@/context/FamilyDataContext";
import { PetTimelineProvider } from "@/context/PetTimelineContext";
import { useUserFamiliesContext } from "@/context/UserFamiliesContext";
import FamilyHeader from "@/components/FamilyHeader";

const FamilyLayout: React.FC = () => {
  const { families } = useUserFamiliesContext();
  const { familyId: familyIdParam } = useParams<{ familyId: string }>();
  const location = useLocation();

  if (!familyIdParam && families.length > 0) {
    const defaultFamilyId = families[0].id;
    const newPath = location.pathname.replace(
      "/family",
      `/family/${defaultFamilyId}`
    );
    return <Navigate to={newPath} replace />;
  }

  const familyId = familyIdParam ? parseInt(familyIdParam, 10) : null;

  if (familyId === null || isNaN(familyId)) {
    return <div>Error: Invalid Family ID</div>;
  }

  return (
    <FamilyDataProvider familyId={familyId}>
      <PetTimelineProvider>
        <FamilyHeader className="w-full" />
        <Outlet context={{ familyId }} />
      </PetTimelineProvider>
    </FamilyDataProvider>
  );
};

export default FamilyLayout;
