import React from "react";
import { useParams } from "react-router-dom";
import { useFamilyData } from "../hooks/useFamilyData";
import { JsonToTable } from "react-json-to-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FamilyData, PetDB, LocationDB, MomentDB } from "../db/db_types";

const ContentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // TODO - default to first family for user
  const familyIdNumber = id ? parseInt(id, 10) : 7;

  const { data, error, isLoading } = useFamilyData(familyIdNumber);
  console.log("data", data);
  const convertToString = (date: string | undefined): String | undefined => {
    if (!date) {
      return undefined;
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  };

  const convertFamilyData = (data: any): FamilyData => {
    if (!data) {
      return {
        pets: [],
        locations: [],
        users: [],
        moments: [],
      };
    } else {
      return {
        pets: data.pets.map((pet: PetDB) => ({
          ...pet,
          start_date: convertToString(pet.start_date),
          end_date: convertToString(pet.end_date || undefined),
        })),
        locations: data.locations.map((location: LocationDB) => ({
          ...location,
          start_date: convertToString(location.start_date),
          end_date: convertToString(location.end_date || undefined),
        })),
        users: data.users, // Assuming users don't have date fields
        moments: data.moments.map((moment: MomentDB) => ({
          ...moment,
          start_date: convertToString(moment.start_date),
          end_date: convertToString(moment.end_date || undefined),
        })),
      };
    }
  };

  const updatedData = convertFamilyData(data);

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
