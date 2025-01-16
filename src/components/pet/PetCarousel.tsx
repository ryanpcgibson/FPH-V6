import React, { useState } from "react";
import { Photo } from "@/db/db_types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

interface PetCarouselProps {
  moments: any[];
  currentMomentIndex: number;
  setCurrentMomentIndex: (index: number) => void;
}

const PetCarousel: React.FC<PetCarouselProps> = ({
  moments,
  currentMomentIndex,
}) => {
  const photos = moments[currentMomentIndex]?.photos || [];
  const [emblaRef, emblaApi] = useEmblaCarousel();

  // Define the styles as JavaScript objects
  const emblaStyle = {
    overflow: "hidden",
    height: "100%",
  };

  const emblaContainerStyle = {
    display: "flex",
    height: "100%",
  };

  const emblaSlideStyle = {
    flex: "0 0 100%",
    minWidth: "0",
    height: "100%",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 z-10">
        <Carousel
          opts={{
            align: "start",
          }}
          ref={emblaRef}
          style={emblaStyle}
        >
          <CarouselContent style={emblaContainerStyle} className="h-full">
            {photos.map((photo: Photo, index: number) => (
              <CarouselItem
                key={photo.id || index}
                style={emblaSlideStyle}
              >
                <img
                  src={`/src/assets/${photo.path}`}
                  alt={`Pet photo ${index + 1}`}
                  className="w-full h-full object-contain max-h-[330px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
      {/* <div className="absolute bottom-0 left-0 right-0 z-20 p-2 bg-white bg-opacity-50">
        {photos.length > 0 ? (
          <div className="text-center">
            Photo {currentPhotoIndex + 1} / {photos.length}
          </div>
        ) : (
          <div className="text-center">No Photos</div>
        )}
      </div> */}
    </div>
  );
};

export default PetCarousel;
