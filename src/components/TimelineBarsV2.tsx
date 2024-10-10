import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PetTimeline } from "@/context/PetTimelineContext";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import TimelineCell from "./TimelineCell";

const patternIds = ["9", "10", "22", "40"]; // Define pattern IDs to use

interface TimelineBarsProps {
  petTimelines: PetTimeline[];
  petId?: number;
}
const TimelineBars: React.FC<TimelineBarsProps> = ({ petTimelines, petId }) => {
  const {
    familyData,
    familyId,
    isLoading: isFamilyLoading,
    error: familyError,
  } = useFamilyDataContext();
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

  const gridTitle: React.ReactNode = (
    <a href={`/app/family/${familyId}`} className="text-xl">
      <span className="whitespace-nowrap">
        The {familyData?.family_name} Family
      </span>
    </a>
  );

  const rows = 20;
  const cols = 10;
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
      className="w-full h-screen overflow-auto" // overflow-scroll?
      data-testid="double-scroll-grid-container"
    >
      <div
        className="relative"
        style={{ minWidth: `${minWidth}px` }}
        data-testid="grid-content"
      >
        {/* Sticky column headers */}
        <div
          className="sticky top-0 z-10 bg-gray-200"
          data-testid="column-header-container"
        >
          <div className="flex">
            {Array.from({ length: cols }, (_, index) => (
              <div
                key={index}
                className="w-20 h-10 flex items-center justify-center font-bold border border-gray-300"
                data-testid={`column-header-${index}`}
              >
                {String.fromCharCode(65 + index)}
              </div>
            ))}
            {/* Top-right corner cell */}
            <div
              className="sticky right-0 z-30 w-20 h-10 flex items-center justify-center font-bold border border-gray-300 bg-gray-300"
              data-testid="top-right-corner"
            ></div>
          </div>
        </div>

        {/* Table body */}
        <div className="relative" data-testid="grid-body">
          {data.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex"
              data-testid={`row-${rowIndex}`}
            >
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className="w-20 h-10 flex items-center justify-center border border-gray-300"
                  data-testid={`cell-${rowIndex}-${colIndex}`}
                >
                  {cell}
                </div>
              ))}
              {/* Sticky row headers */}
              <div
                className="sticky right-0 z-20 w-20 h-10 flex items-center justify-center font-bold bg-gray-200 border border-gray-300"
                data-testid={`row-header-${rowIndex}`}
              >
                {rowIndex + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Spacer to hide scrolling content */}
      <div
        className="fixed top-0 right-0 w-20 h-10 bg-gray-300 z-40"
        data-testid="scroll-spacer"
      ></div>
    </div>
  );
};

export default TimelineBars;
