import React from "react";
import { useNavigate } from "react-router-dom";
import { PetTimeline } from "@/context/PetTimelineContext";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import TimelineBar from "@/components/TimelineBar";
import TimelineCell from "@/components/TimelineCell";
import DoubleScrollGrid from "../components/DoubleScrollGrid";

interface TimelineBarsProps {
  petTimelines: PetTimeline[];
  petId?: number;
}

const TimelineBars: React.FC<TimelineBarsProps> = ({ petTimelines, petId }) => {
  const { familyId } = useFamilyDataContext();
  const navigate = useNavigate();
  console.log("Pet Timelines JSON:", JSON.stringify(petTimelines, null, 2));

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
        key={year}
        segment={segment}
        year={year}
        petId={pet.petId}
        onClick={handleSegmentClick || (() => {})}
      />
    );
  };

  return (
    <DoubleScrollGrid
      getData={getData}
      columnHeaders={columnHeaders}
      rowHeaders={rowHeaders}
    />
  );
  //   const allYears = timelinesToRender.flatMap((timeline) =>
  //     timeline.segments.map((segment) => segment.year)
  //   );
  //   const minYear = Math.min(...allYears);
  //   const maxYear = Math.max(...allYears);
  //   const yearRange = maxYear - minYear + 1;

  //   return (
  //     <div>
  //       <div className="overflow-x-auto">
  //         <div
  //           className={`inline-grid gap-px debug-border2`}
  //           style={{
  //             gridTemplateColumns: `${
  //               petId ? "" : "auto"
  //             } repeat(${yearRange}, 100px)`,
  //           }}
  //           data-testid="timeline-grid"
  //         >
  //           {!petId && <div className="w-40"></div>}
  //           <TimelineBar
  //             isHeader={true}
  //             yearRange={yearRange}
  //             minYear={minYear}
  //           />
  //           {timelinesToRender.map((timeline) => (
  //             <TimelineBar
  //               key={timeline.petId}
  //               timeline={timeline}
  //               yearRange={yearRange}
  //               minYear={minYear}
  //               petId={petId}
  //               onSegmentClick={handleSegmentClick}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
};

export default TimelineBars;
