import React, { useState, useEffect } from "react";
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
import { supabaseClient } from "@/db/supabaseClient";
import { useNavigate } from "react-router-dom";

interface PetCarouselProps {
  moments: any[];
  currentMomentIndex: number;
  setCurrentMomentIndex: (index: number) => void;
}

const getSignedUrlForPhoto = async (photo: Photo) => {
  const { data, error } = await supabaseClient.storage
    .from("photos")
    .createSignedUrl(photo.name, 60);
  return data?.signedUrl;
};

const PetCarousel: React.FC<PetCarouselProps> = ({
  moments,
  currentMomentIndex,
}) => {
  const photos = moments[currentMomentIndex]?.photos || [];
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    photos.forEach(async (photo) => {
      const url = await getSignedUrlForPhoto(photo);
      if (url) {
        setPhotoUrls((prev) => ({ ...prev, [photo.id]: url }));
      }
    });
  }, [photos]);

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
            {photos.map(
              (photo: { id?: string; path: string }, index: number) => (
                <CarouselItem key={photo.id || index} style={emblaSlideStyle}>
                  <img
                    src={photoUrls[photo.id]}
                    alt={`Pet photo ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </CarouselItem>
              )
            )}
            <CarouselItem>
              <div className="h-full flex items-center justify-center">
                <Button
                  onClick={() =>
                    navigate(
                      `/app/family/${moments[currentMomentIndex].family_id}/moment/${moments[currentMomentIndex].id}/upload`
                    )
                  }
                >
                  Add photo
                </Button>
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
