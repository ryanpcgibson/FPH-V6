import React from "react";
import petTimelinesData from "@/db/dummy_petTimelines.json";
// import TimelineCell from "@/components/TimelineCell";

const testYears = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const petTimelines = petTimelinesData;

const YearHeader: React.FC = () => (
  <thead className="sticky top-0 z-10 bg-white">
    <tr>
      {testYears.map((year) => (
        <th
          key={year}
          className="w-24 min-w-[6rem] p-2 text-center font-bold border"
        >
          {year}
        </th>
      ))}
    </tr>
  </thead>
);

const TimelineCell: React.FC<{
  segment: string;
  year: number;
  petId: number;
}> = ({ segment, year, petId }) => {
  return (
    <td key={year} className="border p-0">
      {segment}
    </td>
  );
};

const TimelineContent: React.FC<{
  onCellClick: (petId: number, momentId?: number) => void;
}> = ({ onCellClick }) => (
  <tbody>
    {petTimelines.map((pet) => (
      <tr key={pet.petId}>
        {testYears.map((year) => {
          const segment = pet.segments.find((s) => s.year === year);
          return (
            <td key={year} className="border p-0">
              <TimelineCell
                segment={segment}
                year={year}
                petId={pet.petId}
                onClick={onCellClick}
              />
            </td>
          );
        })}
      </tr>
    ))}
  </tbody>
);

const NameColumn: React.FC = () => (
  <div className="w-40 min-w-[10rem] overflow-y-auto">
    <table className="w-full h-full border-collapse">
      <thead>
        <tr>
          <th className="sticky top-0 z-10 bg-white border p-2">Name</th>
        </tr>
      </thead>
      <tbody>
        {petTimelines.map((pet) => (
          <tr key={pet.petId}>
            <td className="border p-2 whitespace-nowrap">{pet.petName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TestPage: React.FC = () => {
  const handleCellClick = (petId: number, momentId?: number) => {
    console.log(`Clicked: Pet ID ${petId}, Moment ID ${momentId || "N/A"}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-grow overflow-hidden">
        <div className="h-full flex">
          {/* Scrollable content area */}
          <div className="flex-grow overflow-auto">
            <table className="w-full border-collapse">
              <YearHeader />
              <TimelineCell />
            </table>
          </div>

          {/* Fixed right column for names */}
          <NameColumn />
        </div>
      </div>
    </div>
  );
};

export default TestPage;
