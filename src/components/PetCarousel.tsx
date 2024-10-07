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
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [emblaApi, setEmblaApi] = useState<any>(null);

  useEffect(() => {
    if (moments && moments.length > 0) {
      setPhotos(moments[currentMomentIndex].photos);
      setCurrentPhotoIndex(0);
    }
  }, [moments, currentMomentIndex]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const goToPrevMoment = () => {
    if (currentMomentIndex > 0) {
      setCurrentMomentIndex(currentMomentIndex - 1);
    }
  };

  const goToNextMoment = () => {
    if (currentMomentIndex < moments.length - 1) {
      setCurrentMomentIndex(currentMomentIndex + 1);
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="absolute top-0 left-0 right-0 z-20 p-2 bg-white bg-opacity-50">
        <CarouselControls
          currentIndex={currentMomentIndex}
          totalCount={moments.length}
          onPrevClick={goToPrevMoment}
          onNextClick={goToNextMoment}
          renderCenter={() => {
            const moment = moments[currentMomentIndex];
            const title = moment?.title || `Moment ${currentMomentIndex + 1}`;
            const start_date = moment?.start_date
              ? new Date(moment.start_date).toISOString().split("T")[0]
              : "";
            const end_date = moment?.end_date
              ? new Date(moment.end_date).toISOString().split("T")[0]
              : "";
            return `${title} - ${start_date} - ${end_date}`;
          }}
        />
      </div>
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
