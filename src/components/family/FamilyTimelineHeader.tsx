import React from "react";

interface TimelineHeaderProps {
  columnHeaders: string[];
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ columnHeaders }) => {
  return (
    <div className="sticky top-0 z-50 bg-white" id="column-header-container">
      <div className="flex gap-1" id="column-headers">
        {columnHeaders.map((header, index) => (
          <div
            key={index}
            className="w-[80px] h-10 flex items-center justify-center font-bold bg-gray-200"
            id={`column-header-${index}`}
          >
            {header}
          </div>
        ))}
        <div
          className="sticky right-0 z-30 w-20 h-10 flex items-center justify-center font-bold bg-white"
          id="top-right-corner"
        />
      </div>
    </div>
  );
};

export default TimelineHeader;
