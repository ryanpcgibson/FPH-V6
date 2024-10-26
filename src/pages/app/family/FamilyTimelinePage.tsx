import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import TimelineBars from "@/components/TimelineBars";

const TimelinePage: React.FC = () => {
  const {
    petTimelines,
    isLoading: isPetTimelineLoading,
    error: petTimelineError,
  } = usePetTimelineContext();

  const isLoading = isPetTimelineLoading;
  const error = petTimelineError;

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

  console.log("petTimelines:", petTimelines);

  return (
    <div className="flex flex-row h-screen" id="page-container">
      <TimelineBars petTimelines={petTimelines} />
    </div>
  );
};

export default TimelinePage;
