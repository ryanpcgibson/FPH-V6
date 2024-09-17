import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pet, Photo, Moment } from "@/db/db_types";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { FamilyData } from "@/hooks/useFamilyData";
import EmblaCarousel from "@/components/ui/EmblaCarousel";
import CarouselControls from "@/components/ui/CarouselControls";
import { formatDateForDisplay } from "@/utils/dateUtils";

const PetInfo: React.FC = () => {
  const { petId: petIdParam } = useParams<{ petId: string }>();
  const petId = petIdParam ? parseInt(petIdParam, 10) : null;

  const [petData, setPetData] = useState<Pet | undefined>(undefined);

  const { familyData, isLoading, error } = useFamilyDataContext();
  const [moments, setMoments] = useState<FamilyData["moments"]>([]);
  const [currentMomentIndex, setCurrentMomentIndex] = useState<number>(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [emblaApi, setEmblaApi] = useState<any>(null);

  useEffect(() => {
    if (familyData && petId) {
      setPetData(familyData.pets.find((pet: Pet) => pet.id === petId));
      const petMoments = familyData.moments.filter((moment: Moment) =>
        moment.pets.some((pet: { id: number }) => pet.id === petId)
      );
      setMoments(petMoments);
      setCurrentMomentIndex(0);
    }
  }, [familyData, petId]);

  useEffect(() => {
    if (familyData && petData) {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading ...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col sm:flex-row gap-4 items-stretch justify-center min-h-screen p-0"
      id="pet-detail-container"
    >
      <div
        className="w-full sm:w-3/5 flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[600px]"
        id="carousel-wrapper"
      >
        <div
          className="flex-grow flex flex-col overflow-hidden relative bg-white"
          id="carousel-card"
        >
          {/* Main carousel container */}
          <div className="absolute inset-0 z-0" id="carousel-container">
            <EmblaCarousel
              photos={photos}
              setCurrentIndex={setCurrentPhotoIndex}
              setEmblaApi={setEmblaApi}
            />
          </div>

          {/* Top control bar for moments */}
          <div
            className="relative z-10 bg-white bg-opacity-50"
            id="moment-controls"
          >
            <div className="" id="moment-controls-inner">
              {moments.length > 1 && (
                <CarouselControls
                  currentIndex={currentMomentIndex}
                  totalCount={moments.length}
                  onPrevClick={() =>
                    setCurrentMomentIndex(currentMomentIndex - 1)
                  }
                  onNextClick={() =>
                    setCurrentMomentIndex(currentMomentIndex + 1)
                  }
                  renderCenter={() => moments[currentMomentIndex]?.title || ""}
                />
              )}
            </div>
          </div>

          {/* Spacer to push bottom controls to the bottom */}
          <div className="flex-grow" />

          {/* Bottom control bar for photos */}
          <div
            className="relative z-10 bg-white bg-opacity-50"
            id="photo-controls"
          >
            <div className="" id="photo-controls-inner">
              {photos.length > 1 && (
                <CarouselControls
                  currentIndex={currentPhotoIndex}
                  totalCount={photos.length}
                  onPrevClick={scrollPrev}
                  onNextClick={scrollNext}
                  renderCenter={() =>
                    `${currentPhotoIndex + 1}/${photos.length}`
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="w-full sm:w-2/5 max-w-[1000px] flex-grow max-h-[calc(100vh-2rem)] sm:max-h-[600px]"
        id="pet-info-container"
      >
        <div className="h-full overflow-auto bg-white" id="pet-info-card">
          <div className="mt-8" id="pet-info-header">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {petData?.name}
            </h3>
          </div>
          <div className="" id="pet-info-content">
            <div className="mt-4" id="moment-selector">
              <Select
                value={currentMomentIndex?.toString() ?? ""}
                onValueChange={(value) =>
                  setCurrentMomentIndex(parseInt(value, 10))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a moment" />
                </SelectTrigger>
                <SelectContent>
                  {moments.map((moment, index) => (
                    <SelectItem key={moment.id} value={index.toString()}>
                      {moment.title} {formatDateForDisplay(moment.start_date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetInfo;
