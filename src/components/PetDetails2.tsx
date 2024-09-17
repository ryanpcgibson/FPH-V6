import React from "react";
import { Pet } from "@/db/db_types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateForDisplay } from "@/utils/dateUtils";

interface PetInfoCardProps {
  petData: Pet | undefined;
  moments: any[];
  currentMomentIndex: number;
  setCurrentMomentIndex: (index: number) => void;
}

const PetDetails: React.FC<PetInfoCardProps> = ({
  petData,
  moments,
  currentMomentIndex,
  setCurrentMomentIndex,
}) => {
  return (
    <div
      className="w-full sm:w-2/5 max-w-[1000px] flex-grow max-h-[calc(100vh-2rem)] sm:max-h-[600px]"
      id="pet-info-container"
    >
      <div className="bg-white shadow-lg rounded-lg p-6 h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{petData?.name}</h2>
        <p className="mb-2">
          <span className="font-semibold">Alive:</span>{" "}
          {petData?.start_date ? formatDateForDisplay(petData.start_date) : "Unknown"}
          {petData?.end_date ? " - " + formatDateForDisplay(petData.end_date) : ""}
        </p>
        <p className="mb-4">
          <span className="font-semibold">Description:</span> {petData?.description}
        </p>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Moments</h3>
          <Select
            value={currentMomentIndex.toString()}
            onValueChange={(value) => setCurrentMomentIndex(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a moment" />
            </SelectTrigger>
            <SelectContent>
              {moments.map((moment, index) => (
                <SelectItem key={moment.id} value={index.toString()}>
                  {moment.title || `Moment ${index + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
