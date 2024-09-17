import React, { useEffect, useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";
import { Photo } from "@/db/db_types";

interface EmblaCarouselProps {
  photos: Photo[];
  options?: EmblaOptionsType;
  setCurrentIndex: (index: number) => void;
  setEmblaApi: (api: EmblaCarouselType) => void;  // Add this line
}

const EmblaCarousel: React.FC<EmblaCarouselProps> = ({ 
  photos, 
  options, 
  setCurrentIndex,
  setEmblaApi  // Add this parameter
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  useEffect(() => {
    if (emblaApi) {
      setEmblaApi(emblaApi);  // Set the emblaApi in the parent component
    }
  }, [emblaApi, setEmblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      const onSelect = () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      };
      emblaApi.on("select", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [photos, emblaApi, setCurrentIndex]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="embla flex-grow">
        <div className="embla__viewport h-full w-full" ref={emblaRef}>
          <div className="embla__container h-full w-full">
            {photos.map((photo, index) => (
              <div
                className="embla__slide h-full w-full"
                key={photo.id || index}
              >
                <div className="embla__slide__inner h-full w-full flex items-center justify-center">
                  <img
                    src={`/src/assets/${photo.path}`}
                    alt={`Pet photo ${index + 1}`}
                    className="embla__slide__img object-contain max-h-full max-w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
