import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselControlsProps {
  currentIndex: number;
  totalCount: number;
  onPrevClick: () => void;
  onNextClick: () => void;
  renderCenter: () => React.ReactNode; // New prop for custom center content
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  currentIndex,
  totalCount,
  onPrevClick,
  onNextClick,
  renderCenter,
}) => {
  return (
    <div className="flex justify-between items-center mt-2">
      {currentIndex > 0 ? (
        <button
          onClick={onPrevClick}
          className="p-1 bg-gray-200 text-gray-800 rounded h-8 w-8 flex items-center justify-center"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      ) : (
        <div className="h-8 w-8" /> // Empty div to maintain layout
      )}
      <div className="text-center">{renderCenter()}</div>
      {currentIndex < totalCount - 1 ? (
        <button
          onClick={onNextClick}
          className="p-1 bg-gray-200 text-gray-800 rounded h-8 w-8 flex items-center justify-center"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      ) : (
        <div className="h-8 w-8" /> // Empty div to maintain layout
      )}
    </div>
  );
};

export default CarouselControls;
