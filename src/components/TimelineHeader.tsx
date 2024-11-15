import React from "react";

interface TimelineHeaderProps {
  headerTexts: string[];
  headerStyles?: string[];
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  headerTexts,
  headerStyles,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white" id="column-header-container">
      <div className="flex gap-1" id="column-headers">
        {headerTexts.map((header, index) => (
          <div
            key={index}
            className={`w-[80px] h-10 flex items-center justify-center font-bold ${
              headerStyles?.[index] ?? "bg-gray-200"
            }`}
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
