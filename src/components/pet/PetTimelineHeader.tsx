import React from "react";

interface PetTimelineHeaderProps {
  rowHeaders: number[];
}

const PetTimelineHeader: React.FC<PetTimelineHeaderProps> = ({
  rowHeaders,
}) => {
  return (
    <div
      className="sticky top-0 right-0 z-20 flex flex-col"
      id="timeline-header"
    >
      {/* Year Headers */}
      {[...rowHeaders].reverse().map((year) => (
        <div
          key={year}
          className={`w-20 h-10 flex items-center justify-center font-bold bg-gray-200 border-y-2
             border-white`}
        >
          {year}
        </div>
      ))}

      {/* Empty cell for alignment with name column */}
      <div className="sticky right-0 z-20 w-20 h-10" />
    </div>
  );
};

export default PetTimelineHeader;
