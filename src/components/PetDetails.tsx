import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pet } from "@/db/db_types";
import { formatDateForDisplay } from "@/utils/dateUtils";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import { FamilyData } from "@/hooks/useFamilyData";

const PetDetails: React.FC<{
  pet: Pet;
  moments: FamilyData["moments"];
  currentMomentIndex: number;
  setCurrentMomentIndex: (index: number) => void;
}> = ({ pet, moments, currentMomentIndex, setCurrentMomentIndex }) => {
  const { petTimelines } = usePetTimelineContext();

  return (
    <>
      <div className="mt-4">
        <Select
          value={currentMomentIndex?.toString() ?? ""}
          onValueChange={(value) => setCurrentMomentIndex(parseInt(value, 10))}
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
    </>
  );
};

export default PetDetails;
