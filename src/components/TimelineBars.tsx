import React from "react";
import { cn } from "@/lib/utils";

interface TimelineBarsProps {
  data: { width: number; photo: string }[];
  onBarClick: (photo: string) => void;
}

const HorizontalBar: React.FC<{
  width: number;
  backgroundColor: string;
  onClick: () => void;
}> = ({ width, backgroundColor, onClick }) => {
  return (
    <div
      className={cn(
        "h-8 rounded cursor-pointer transition-all hover:opacity-80",
        backgroundColor
      )}
      style={{ width: `${width}px` }}
      onClick={onClick}
    />
  );
};

const TimelineBars: React.FC<TimelineBarsProps> = ({ data, onBarClick }) => {
  const getBackgroundColor = (index: number) => {
    const colors = [
      "bg-gray-300",
      "bg-gray-400",
      "bg-gray-500",
      "bg-gray-600",
      "bg-gray-700",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-4">
      <div className="flex overflow-x-auto gap-4">
        <div className="flex flex-col gap-4">
          {data.map((item, index) => (
            <HorizontalBar
              key={index}
              width={item.width}
              backgroundColor={getBackgroundColor(index)}
              onClick={() => onBarClick(item.photo)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineBars;
