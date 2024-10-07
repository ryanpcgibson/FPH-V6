import React from "react";
import { Pet } from "@/db/db_types";
import { FamilyData } from "@/hooks/useFamilyData";
import { formatDateForDisplay } from "@/utils/dateUtils";
import FamilyLink from "@/components/FamilyLink";

interface PetInfoCardProps {
  petData: Pet | undefined;
  familyData: FamilyData | undefined;
  familyId: number;
  moments: any[];
  currentMomentIndex: number;
  setCurrentMomentIndex: (index: number) => void;
}

const PetDetails: React.FC<PetInfoCardProps> = ({
  petData,
  familyData,
  familyId,
}) => {
  return (
    <div className="bg-red-500">
      <h2>{petData?.name}</h2>
      <h2>
        Alive:{" "}
        {petData?.start_date
          ? formatDateForDisplay(petData.start_date)
          : "Unknown"}
        {petData?.end_date
          ? " - " + formatDateForDisplay(petData.end_date)
          : ""}
      </h2>
      <h2>
        Family:{" "}
        <FamilyLink familyId={familyId} familyName={familyData?.family_name} />
      </h2>
      <h2>
        Description:
        {petData?.description}
      </h2>
    </div>
  );
};

export default PetDetails;
