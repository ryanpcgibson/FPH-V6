// pages/DataPage.tsx - debugging page to see raw family data

import React from "react";
import { useFamilyDataContext } from "../../context/FamilyDataContext";
import { JsonToTable } from "react-json-to-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pet, Location, Moment } from "@/db/db_types";
import { FamilyData } from "@/hooks/useFamilyData";
import { convertDateToISODateString } from "@/utils/dateUtils";

const FamilyDataPage: React.FC = () => {
  const { familyData, isLoading, error } = useFamilyDataContext();

  const convertFamilyData = (familyData: any): FamilyData => {
    if (!familyData) {
      return {
        pets: [],
        locations: [],
        users: [],
        moments: [],
      };
    } else {
      return {
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
    <Card>
      <CardHeader>
        <CardTitle>Family Data</CardTitle>
      </CardHeader>
      <CardContent>
        <JsonToTable json={updatedData} />
        <pre>{JSON.stringify(updatedData, null, 2)}</pre>
      </CardContent>
    </Card>
  );
};

export default FamilyDataPage;
