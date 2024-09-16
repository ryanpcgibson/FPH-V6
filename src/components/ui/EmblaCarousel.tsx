import React, { useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";
import { Photo } from "../../db/db_types";

interface EmblaCarouselProps {
  photos: Photo[];
  options?: EmblaOptionsType;
}

const EmblaCarousel: React.FC<EmblaCarouselProps> = ({ photos, options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [photos, emblaApi]);

  return (
    <div className="embla h-full w-full">
      <div className="embla__viewport h-full w-full" ref={emblaRef}>
        <div className="embla__container h-full w-full">
          {photos.map((photo, index) => (
            <div className="embla__slide h-full w-full" key={photo.id || index}>
              <div className="embla__slide__inner h-full w-full">
                <img
                  src={photo.path}
                  alt={`Pet photo ${index + 1}`}
                  className="embla__slide__img"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
