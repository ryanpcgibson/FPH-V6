import React from "react";

interface TimelineHeaderProps {
  columnHeaders: number[];
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ columnHeaders }) => {
  return (
    <div className="sticky top-0 z-50" data-testid="column-header-container">
      <div className="flex" data-testid="column-headers">
        <div className="flex">
          {columnHeaders.map((header, index) => (
            <div
              key={index}
              className="w-20 h-10 flex items-center justify-center font-bold bg-gray-200 border-white border-2 box-border"
              data-testid={`column-header-${index}`}
            >
              {header}
            </div>
          ))}
        </div>
        <div
          className="sticky right-0 z-30 w-20 h-10 flex items-center justify-center font-bold bg-white"
          data-testid="top-right-corner"
        />
      </div>
    </div>
  );
};

export default TimelineHeader; 