import React, { useState, useCallback, useEffect } from "react";
import { Photo } from "@/db/db_types";
import EmblaCarousel from "@/components/ui/EmblaCarousel";
import CarouselControls from "@/components/ui/CarouselControls";

interface PetCarouselProps {
  moments: any[];
  currentMomentIndex: number;
  setCurrentMomentIndex: (index: number) => void;
}

const PetCarousel: React.FC<PetCarouselProps> = ({
  moments,
  currentMomentIndex,
  setCurrentMomentIndex,
}) => {
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photos = moments[currentMomentIndex]?.photos || [];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-grow z-10 overflow-hidden">
        <EmblaCarousel
          photos={photos || []}
          setEmblaApi={setEmblaApi}
          setCurrentIndex={setCurrentPhotoIndex}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 p-2 bg-white bg-opacity-50">
        {photos ? (
          <CarouselControls
            currentIndex={currentPhotoIndex}
            totalCount={photos.length}
            onPrevClick={scrollPrev}
            onNextClick={scrollNext}
            renderCenter={() =>
              `Photo ${currentPhotoIndex + 1} / ${photos.length}`
            }
          />
        ) : (
          <div className="text-center">No Photos</div>
        )}
      </div>
    </div>
  );
};

export default PetCarousel;
