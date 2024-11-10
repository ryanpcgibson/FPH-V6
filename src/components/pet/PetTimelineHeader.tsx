import React from "react";

interface PetTimelineHeaderProps {
  rowHeaders: number[];
}

const PetTimelineHeader: React.FC<PetTimelineHeaderProps> = ({
  rowHeaders,
}) => {
  return (
    <div className="relative flex" id="timeline-header">
      {/* Year Headers */}
      {rowHeaders.map((year) => (
        <div
          key={year}
          className={`w-20 h-10 flex items-center justify-center font-bold`}
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
