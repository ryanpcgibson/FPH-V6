import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PetTimeline } from "@/context/PetTimelineContext";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import TimelineCell from "./TimelineCell";
import SvgPattern from "@/components/SvgPattern"; // Add this import

const patternIds = ["9", "10", "22", "40"]; // Define pattern IDs to use

interface TimelineBarsProps {
  petTimelines: PetTimeline[];
  petId?: number;
  className?: string;
}
const TimelineBars: React.FC<TimelineBarsProps> = ({
  petTimelines,
  petId,
  className = "",
}) => {
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

  const cols = columnHeaders.length;
  const rows = rowHeaders.length;

  const data = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from(
      { length: cols },
      (_, colIndex) => rowIndex * cols + colIndex + 1
    )
  );

  // Calculate the minimum width based on the number of columns
  const minWidth = (cols + 1) * 80; // 80px per cell (w-20 = 5rem = 80px)

  return (
    <div
      className="w-full flex-grow overflow-auto"
      data-testid="double-scroll-grid-container"
    >
      <div
        className="relative"
        style={{ minWidth: `${minWidth}px`, width: `${minWidth}px` }}
        data-testid="grid-content"
      >
        {/* Sticky column headers */}
        <div
          className="sticky top-0 z-50"
          data-testid="column-header-container"
        >
          <div className="flex" data-testid="column-headers">
            <div className="flex" data-testid="column-headers">
              {columnHeaders.map((header, index) => (
                <div
                  key={index}
                  // className="flex items-center justify-center header-box flex-shrink-0"
                  className="w-20 h-10 flex items-center justify-center font-bold bg-gray-200 border-white border-2 box-border"
                  data-testid={`column-header-${index}`}
                >
                  {header}
                </div>
              ))}
            </div>
            {/* Top-right corner cell */}
            <div
              className="sticky right-0 z-30 w-20 h-10 flex items-center justify-center font-bold bg-white"
              data-testid="top-right-corner"
            ></div>
          </div>
        </div>

        {/* Table body */}
        <div className="relative space-y-1 pt-1" data-testid="grid-body">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="relative flex"
              data-testid={`row-${rowIndex}`}
            >
              <div className="absolute w-full h-full z-0">
                <SvgPattern
                  patternId={patternIds[rowIndex % patternIds.length]}
                />
              </div>

              {Array.from({ length: cols }, (_, colIndex) => (
                <div
                  key={colIndex}
                  className="w-20 h-10 flex items-center justify-center"
                  data-testid={`cell-${rowIndex}-${colIndex}`}
                >
                  {getCellContents(rowIndex, colIndex)}
                </div>

                // <div
                //   key={colIndex}
                //   className="w-20 h-10 flex items-center justify-center border border-gray-300"
                //   data-testid={`cell-${rowIndex}-${colIndex}`}
                // >
                //   {cell}
                // </div>
              ))}
              {/* Sticky row headers */}
              <div
                className="sticky right-0 z-20 w-20 h-10 flex items-center justify-center font-bold bg-yellow-400"
                data-testid={`row-header-${rowIndex}`}
              >
                {rowHeaders[rowIndex]}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Spacer to hide scrolling content */}
      {/* <div
        className="sticky top-0 right-0 w-20 h-10 bg-gray-300 z-40"
        data-testid="scroll-spacer"
      ></div> */}
    </div>
  );
};

export default TimelineBars;
