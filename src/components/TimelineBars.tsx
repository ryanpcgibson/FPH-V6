import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PetTimeline } from "@/context/PetTimelineContext";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import DoubleScrollGrid from "./DoubleScrollGrid";
import TimelineCell from "./TimelineCell";

const patternIdList = ["9", "10", "22", "40"];
const minCellWidth = 80;
const minCellHeight = 30;
const maxCellHeight = 180;
const maxRows = 5;

interface TimelineBarsProps {
  petTimelines: PetTimeline[];
  petId?: number;
}
const TimelineBars: React.FC<TimelineBarsProps> = ({ petTimelines, petId }) => {
  const { familyId } = useFamilyDataContext();
  const navigate = useNavigate();
  // const containerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef(null);

  const [cellStyle, setCellStyle] = useState({
    minWidth: `${minCellWidth}px`,
    width: `${minCellWidth}px`,
    minHeight: `${minCellHeight}px`,
    height: `${minCellHeight}px`,
    maxHeight: `${maxCellHeight}px`,
  });

  const [fullWidth, setFullWidth] = useState(0);
  const [columnHeaders, setColumnHeaders] = useState<number[]>([]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateCellDimensions = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const cellHeight = Math.floor(containerHeight / (maxRows + 1));
        const cellWidth = (cellHeight / minCellHeight) * minCellWidth;
        setCellStyle({
          ...cellStyle,
          height: `${cellHeight}px`,
          width: `${cellWidth}px`,
        });
        setFullWidth(cellWidth * columnHeaders.length);
      }
    };

    updateCellDimensions(); // Initial calculation

    const resizeObserver = new ResizeObserver(updateCellDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

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

  return (
    <div ref={containerRef} className="w-full h-screen overflow-auto">
      <DoubleScrollGrid
        cellStyle={cellStyle}
        fullWidth={fullWidth}
        getData={getData}
        columnHeaders={columnHeaders}
        rowHeaders={rowHeaders}
      />
    </div>
  );
};

export default TimelineBars;
