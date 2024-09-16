import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pet, FamilyData } from "../db/db_types";
import { formatDateForDisplay } from "../dateUtils";

interface PetDetailsCardProps {
  pet: Pet | undefined;
  moments: FamilyData["moments"];
  currentMomentIndex: number;
  setCurrentMomentIndex: (index: number) => void;
}

const PetDetails: React.FC<PetDetailsCardProps> = ({
  pet,
  moments,
  currentMomentIndex,
  setCurrentMomentIndex,
}) => {
  return (
    <>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Pet Details</h2>
        <p>Name: {pet?.name}</p>
        {/* Add more pet details here */}
      </div>
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
