import React from "react";
import { useNavigate } from "react-router-dom";
import { PetTimeline } from "@/context/PetTimelineContext";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import TimelineBar from "@/components/TimelineBar";
import TimelineCell from "@/components/TimelineCell";
import DoubleScrollGrid from "../components/DoubleScrollGrid";

const patternIdList = ["9", "10", "22", "40"];
const cellWidth = 80;
const cellHeight = 30;

interface TimelineBarsProps {
  petTimelines: PetTimeline[];
  petId?: number;
}

const TimelineBars: React.FC<TimelineBarsProps> = ({ petTimelines, petId }) => {
  const { familyId } = useFamilyDataContext();
  const navigate = useNavigate();
  // console.log("Pet Timelines JSON:", JSON.stringify(petTimelines, null, 2));

  const cellStyle = {
    minWidth: `${cellWidth}px`,
    width: `${cellWidth}px`,
    minHeight: `${cellHeight}px`,
    height: `${cellHeight}px`,
  };

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
  const columnHeaders = Array.from(
    { length: latestYear - earliestYear + 1 },
    (_, i) => earliestYear + i
  );

  const rowHeaders = timelinesToRender.map((pet) => pet.petName);

  const getData = (row: number, col: number) => {
    const pet = timelinesToRender[row];
    const year = columnHeaders[col];
    const segment = pet.segments.find((s) => s.year === year);
    return (
      <TimelineCell
        cellStyle={cellStyle}
        segment={segment}
        petId={pet.petId}
        onClick={handleSegmentClick || (() => {})}
        patternId={patternIdList[row % patternIdList.length]}
      />
    );
  };

  console.log("fullWidth", cellWidth * columnHeaders.length);

  return (
    <DoubleScrollGrid
      cellStyle={cellStyle}
      fullWidth={cellWidth * columnHeaders.length}
      getData={getData}
      columnHeaders={columnHeaders}
      rowHeaders={rowHeaders}
    />
  );
};

export default TimelineBars;
