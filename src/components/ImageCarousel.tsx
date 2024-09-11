import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageCarouselProps {
  photo: string;
  closeDrawer: () => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  photo,
  closeDrawer,
}) => {
  const handleNext = () => {
    // Implement the logic to handle the next image
  };

  const handlePrev = () => {
    // Implement the logic to handle the previous image
  };

  return (
    <div className="relative w-full h-full">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <img
        src={photo}
        alt="Current Image"
        className="h-full w-full object-cover"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={closeDrawer}
        className="absolute right-4 top-4 z-10 bg-black/50 hover:bg-black/70 text-white"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ImageCarousel;
