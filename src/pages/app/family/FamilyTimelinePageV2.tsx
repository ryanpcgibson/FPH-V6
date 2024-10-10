import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import TimelineBarsV2 from "@/components/TimelineBarsV2";
import FamilyHeader from "@/components/FamilyHeader";
const TimelinePageV2: React.FC = () => {
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

  return (
    <div className="flex flex-col w-full h-full min-h-screen">
      <FamilyHeader className="sticky top-0 right-0 z-50" />
      <TimelineBarsV2 className="w-full h-screen" petTimelines={petTimelines} />
    </div>
  );
};

export default TimelinePageV2;
