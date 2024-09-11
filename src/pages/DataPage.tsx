import React from "react";
import { useParams } from "react-router-dom";
import { useFamilyData } from "../hooks/useFamilyData";
import { JsonToTable } from "react-json-to-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ContentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // TODO - default to first family for user
  const familyIdNumber = id ? parseInt(id, 10) : 7;

  const { data, error, isLoading } = useFamilyData(familyIdNumber);

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
        <JsonToTable json={data} />
      </CardContent>
    </Card>
  );
};

export default ContentPage;
