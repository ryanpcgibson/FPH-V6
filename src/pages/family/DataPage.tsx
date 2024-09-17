// pages/DataPage.tsx - debugging page to see raw family data

import React from "react";
import { useFamilyDataContext } from "../../context/FamilyDataContext";
import { JsonToTable } from "react-json-to-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FamilyData, Pet, Location, Moment } from "../../db/db_types";

const ContentPage: React.FC = () => {
  const { familyData, isLoading, error } = useFamilyDataContext();

  // TODO: move this to a utils file and rename
  // JsonToTable can't handle Date objects, so convert them (back) to strings
  const convertToString = (date: Date | undefined): String | undefined => {
    if (!date) {
      return undefined;
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  };

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
          start_date: convertToString(pet.start_date),
          end_date: convertToString(pet.end_date || undefined),
        })),
        locations: familyData.locations.map((location: Location) => ({
          ...location,
          start_date: convertToString(location.start_date),
          end_date: convertToString(location.end_date || undefined),
        })),
        users: familyData.users, // Assuming users don't have date fields
        moments: familyData.moments.map((moment: Moment) => ({
          ...moment,
          start_date: convertToString(moment.start_date),
          end_date: convertToString(moment.end_date || undefined),
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

export default ContentPage;
