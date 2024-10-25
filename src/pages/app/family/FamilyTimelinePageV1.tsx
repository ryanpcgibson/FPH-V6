import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import TimelineBars from "@/components/TimelineBarsV1";

const TimelinePageV1: React.FC = () => {
  const { isLoading: isFamilyLoading, error: familyError } =
    useFamilyDataContext();
  const {
    petTimelines,
    isLoading: isPetTimelineLoading,
    error: petTimelineError,
  } = usePetTimelineContext();

  const isLoading = isFamilyLoading || isPetTimelineLoading;
  const error = familyError || petTimelineError;

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

  return <TimelineBars petTimelines={petTimelines} />;
};

export default TimelinePageV1;
