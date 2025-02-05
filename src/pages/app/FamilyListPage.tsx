import React from "react";
import { useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FamilyListPage = () => {
  const { families } = useFamilyDataContext();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Family</CardTitle>
          <CardDescription>Choose a family to view or manage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {families?.map((family) => (
              <Button
                key={family.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/app/family/${family.id}`)}
              >
                {family.name}
              </Button>
            ))}
            <Button
              onClick={() => navigate("/app/family/add")}
              className="mt-4"
            >
              Create New Family
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyListPage;
