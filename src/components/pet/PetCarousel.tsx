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
import PhotoUploadModal from "@/components/photo/PhotoUploadModal";

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
  setCurrentMomentIndex,
}) => {
  const photos = moments[currentMomentIndex]?.photos || [];
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const currentMoment = moments[currentMomentIndex];

  useEffect(() => {
    photos.forEach(async (photo) => {
      const url = await getSignedUrlForPhoto(photo);
      if (url) {
        setPhotoUrls((prev) => ({ ...prev, [photo.id]: url }));
      }
    });
  }, [photos]);

  return (
    <Card className="w-full h-full p-0">
      <CardContent className="h-full p-2">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          ref={emblaRef}
          className="h-full overflow-hidden"
        >
          <CarouselContent className="h-full">
            {photos.map(
              (photo: { id?: string; path: string }, index: number) => (
                <CarouselItem
                  key={photo.id || index}
                  className="flex-[0_0_100%] min-w-0 h-full rounded-lg"
                >
                  <img
                    src={photoUrls[photo.id || ""]}
                    alt={`Pet photo ${index + 1}`}
                    className="w-auto h-auto m-auto max-w-full max-h-full object-contain rounded-lg"
                  />
                </CarouselItem>
              )
            )}
            <CarouselItem className="rounded-lg overflow-hidden">
              <div className="h-full flex items-center justify-center">
                <Button onClick={() => setIsUploadModalOpen(true)}>
                  Add photo
                </Button>
              </div>
            </CarouselItem>
          </CarouselContent>
          {photos.length > 0 && (
            <>
              <CarouselPrevious className="left-4 hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground" />
              <CarouselNext className="right-4 hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground" />
            </>
          )}
        </Carousel>
      </CardContent>
      {currentMoment && (
        <PhotoUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          momentId={currentMoment.id}
          onUploadComplete={(files) => {
            setIsUploadModalOpen(false);
          }}
        />
      )}
    </Card>
  );
};

export default PetCarousel;
