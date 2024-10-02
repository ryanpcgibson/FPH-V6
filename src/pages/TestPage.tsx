import React, { useEffect, useRef } from "react";
import petTimelinesData from "@/db/dummy_petTimelines.json";
import TimelineCell from "@/components/TimelineCell";

const testYears = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const petTimelines = petTimelinesData;

function Years({ className }: { className?: string }) {
  return (
    <div className="flex">
      {testYears.map((year) => (
        <div key={year} className="w-24 min-w-[6rem] text-center font-bold">
          {year}
        </div>
      ))}
      <div className="w-24 text-center font-bold"></div>
    </div>
  );
}

function Bars({ className }: { className?: string }) {
  const handleCellClick = (petId: number, momentId?: number) => {
    console.log(`Clicked: Pet ID ${petId}, Moment ID ${momentId || "N/A"}`);
  };

  return (
    <div className={className}>
      {petTimelines.map((pet) => (
        <div key={pet.petId} className="flex h-6 mb-4">
          {" "}
          {/* Added h-6 to match cell height */}
          {testYears.map((year) => {
            const segment = pet.segments.find(
              (s: { year: number }) => s.year === year
            );
            return (
              <TimelineCell
                key={year}
                segment={segment}
                year={year}
                petId={pet.petId}
                onClick={handleCellClick}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Names({ className }: { className?: string }) {
  return (
    <div className={className}>
      {petTimelines.map((pet) => (
        <div key={pet.petId} className="h-6 mb-4 flex items-center pl-2">
          {" "}
          {/* Adjusted to match Bars */}
          {pet.petName}
        </div>
      ))}
    </div>
  );
}

const TestPage: React.FC = () => {
  const barsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barsContainerRef.current) {
      barsContainerRef.current.scrollLeft =
        barsContainerRef.current.scrollWidth;
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="grid grid-cols-[1fr,auto] grid-rows-[auto,1fr] h-screen overflow-hidden">
      <div className="sticky top-0 z-10 col-span-2 bg-white">
        <Years />
      </div>
      <div ref={barsContainerRef} className="overflow-auto bg-blue-50">
        <Bars />
      </div>
      <div className="sticky right-0 z-10 bg-yellow-50">
        <Names />
      </div>
    </div>
  );
};

export default TestPage;
