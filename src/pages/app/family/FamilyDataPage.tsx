// pages/DataPage.tsx - debugging page to see raw family data

import React from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { JsonToTable } from "react-json-to-table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pet, Location, Moment } from "@/db/db_types";
import { FamilyData } from "@/hooks/useFamilyData";
import { convertDateToISODateString } from "@/utils/dateUtils";
import { useUser } from "@/context/UserContext";
import FamiliesTable from "@/components/FamiliesTable";

const FamilyDataPage: React.FC = () => {
  const { familyData, familyId, isLoading, error } = useFamilyDataContext();
  const { user } = useUser();

  const convertFamilyData = (familyData: any): FamilyData => {
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
  const updatedData = convertFamilyData(familyData);

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
      <Collapsible>
        <CollapsibleTrigger>User</CollapsibleTrigger>
        <CollapsibleContent>
          <JsonToTable json={user} />
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger>Families</CollapsibleTrigger>
        <CollapsibleContent>
          <FamiliesTable familyId={familyId} />
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger>Family Data</CollapsibleTrigger>
        <CollapsibleContent>
          <JsonToTable json={updatedData} />
          <pre className="text-[10px]">
            {JSON.stringify(updatedData, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FamilyDataPage;
