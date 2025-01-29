import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { FamilyData } from "@/db/db_types";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Card, CardContent } from "@/components/ui/card";
import PetCarousel from "@/components/pet/PetCarousel";
import MomentTimelineFacts from "@/components/moment/MomentTimelineFacts";

const MomentDetailPage: React.FC = () => {
  const { momentId: momentIdParam } = useParams<{ momentId: string }>();
  const momentId = momentIdParam ? parseInt(momentIdParam, 10) : null;
  const { familyData } = useFamilyDataContext();

  const [moments, setMoments] = useState<FamilyData["moments"]>([]);
  const [currentMomentIndex, setCurrentMomentIndex] = useState<number>(0);

  useEffect(() => {
    if (familyData && momentId) {
      const moment = familyData.moments.find((m) => m.id === momentId);
      if (moment) {
        setMoments([moment]);
        setCurrentMomentIndex(0);
      }
    }
  }, [familyData, momentId]);

  return (
    <div className="flex flex-row gap-2 h-full w-full" id="page-container">
      <div
        className="flex flex-col flex-grow w-3/5 h-full"
        id="carousel-container"
      >
            <PetCarousel
              moments={moments}
              currentMomentIndex={currentMomentIndex}
              setCurrentMomentIndex={setCurrentMomentIndex}
            />
      </div>
      <div
        className="flex flex-row flex-grow w-2/5"
        id="moment-detail-container"
      >
        <Card className="w-full bg-purple-400">
          <CardContent className="">
            <MomentTimelineFacts momentId={momentId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MomentDetailPage;
