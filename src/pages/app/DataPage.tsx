// pages/DataPage.tsx - debugging page to see raw family data

import React, { useMemo, useState } from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { JsonToTable } from "react-json-to-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pet, Location, Moment } from "@/db/db_types";
import type { FamilyData } from "@/hooks/useFamilyData";
import { convertDateToISODateString } from "@/utils/dateUtils";
import { useUser } from "@/context/UserContext";
import FamiliesTable from "@/components/FamiliesTable";
import { ChevronRight, ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-md mb-4">
      <button
        className="flex items-center justify-between w-full px-4 py-2 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 mr-2" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-2" />
          )}
          {title}
        </span>
      </button>
      {isOpen && <div className="px-4 py-2">{children}</div>}
    </div>
  );
};

const DataPage: React.FC = () => {
  const { familyData, familyId, isLoading, error } = useFamilyDataContext();
  const { user } = useUser();

  console.log("familyId", familyId);

  const convertFamilyData = (familyData: any): FamilyData => {
    console.log("convertFamilyData", familyData);
    if (!familyData) {
      return {
        family_name: "",
        pets: [],
        locations: [],
        users: [],
        moments: [],
      };
    } else {
      return {
        family_name: familyData.family_name,
        pets: familyData.pets.map((pet: Pet) => ({
          ...pet,
          start_date: convertDateToISODateString(pet.start_date),
          end_date: convertDateToISODateString(pet.end_date || undefined),
        })),
        locations: familyData.locations.map((location: Location) => ({
          ...location,
          start_date: convertDateToISODateString(location.start_date),
          end_date: convertDateToISODateString(location.end_date || undefined),
        })),
        users: familyData.users, // Assuming users don't have date fields
        moments: familyData.moments.map((moment: Moment) => ({
          ...moment,
          start_date: convertDateToISODateString(moment.start_date),
          end_date: convertDateToISODateString(moment.end_date || undefined),
        })),
      };
    }
  };

  const updatedData = useMemo(
    () => convertFamilyData(familyData),
    [familyData]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading ...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <CollapsibleSection title="User">
        <JsonToTable json={user} />
      </CollapsibleSection>
      <CollapsibleSection title="Families">
        <FamiliesTable familyId={familyId} />
      </CollapsibleSection>
      <CollapsibleSection title="Family Data">
        <JsonToTable json={updatedData} />
        <pre className="text-[10px]">
          {JSON.stringify(updatedData, null, 2)}
        </pre>
      </CollapsibleSection>
    </div>
  );
};

export default DataPage;
