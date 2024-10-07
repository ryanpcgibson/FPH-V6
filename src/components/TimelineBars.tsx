import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PetTimeline } from "@/context/PetTimelineContext";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import DoubleScrollGrid from "./DoubleScrollGrid";
import TimelineCell from "./TimelineCell";

const patternIds = ["9", "10", "22", "40"]; // Define pattern IDs to use

interface TimelineBarsProps {
  petTimelines: PetTimeline[];
  petId?: number;
}
const TimelineBars: React.FC<TimelineBarsProps> = ({ petTimelines, petId }) => {
  const { familyId } = useFamilyDataContext();
  const navigate = useNavigate();

  const [columnHeaders, setColumnHeaders] = useState<number[]>([]);

  const handleSegmentClick = (petId: number, momentId?: number) => {
    const url = `/app/family/${familyId}/pet/${petId}`;
    if (momentId) {
      navigate(url, { state: { momentId } });
    } else {
      navigate(url);
    }
  };

  const timelinesToRender = petId
    ? petTimelines.filter((timeline) => timeline.petId === petId)
    : petTimelines;

  const earliestYear = timelinesToRender.reduce(
    (min, pet) =>
      pet.segments.length > 0 ? Math.min(min, pet.segments[0].year) : min,
    Infinity
  );
  const latestYear = timelinesToRender.reduce(
    (max, pet) =>
      pet.segments.length > 0
        ? Math.max(max, pet.segments[pet.segments.length - 1].year)
        : max,
    -Infinity
  );

  useEffect(() => {
    const yearHeaders = Array.from(
      { length: latestYear - earliestYear + 1 },
      (_, i) => earliestYear + i
    );
    setColumnHeaders(yearHeaders);
  }, [latestYear, earliestYear]);

  const rowHeaders = timelinesToRender.map((pet) => pet.petName);

  const getCellContents = (row: number, col: number) => {
    const pet = timelinesToRender[row];
    const year = columnHeaders[col];
    const segment = pet.segments.find((s) => s.year === year);
    return (
      <TimelineCell
        segment={segment}
        petId={pet.petId}
        onClick={handleSegmentClick || (() => {})}
      />
    );
  };

  return (
    <DoubleScrollGrid
      getCellContents={getCellContents}
      columnHeaders={columnHeaders}
      rowHeaders={rowHeaders}
      patternIds={patternIds}
    />
  );
};

export default TimelineBars;
