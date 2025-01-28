import React, { useState } from "react";
import { Photo } from "@/db/db_types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

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
    <Card className="w-full h-full">
      <CardContent className="h-full">
        <CardHeader className="text-xl font-bold">
          <CardTitle>{moments[currentMomentIndex]?.title}</CardTitle>
        </CardHeader>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          ref={emblaRef}
          style={emblaStyle}
        >
          <CarouselContent style={emblaContainerStyle} className="h-full">
            {photos.map((photo: Photo, index: number) => (
              <CarouselItem key={photo.id || index} style={emblaSlideStyle}>
                <img
                  src={`/src/assets/${photo.path}`}
                  alt={`Pet photo ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </CarouselItem>
            ))}
            <CarouselItem>
              <div className="h-full flex items-center justify-center">
                <Button>Add photo</Button>
              </div>
            </CarouselItem>
          </CarouselContent>
          {photos.length > 0 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default PetCarousel;
