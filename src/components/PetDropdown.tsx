// src/components/PetDropdown.tsx

import React from "react";
import { useFamilyData } from "../hooks/useFamilyData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Assuming shadcn provides a Label component

interface PetDropdownProps {
  familyId: number;
  selectedPetId: number | null;
  onSelectPet: (petId: number | null) => void;
}

const PetDropdown: React.FC<PetDropdownProps> = ({
  familyId,
  selectedPetId,
  onSelectPet,
}) => {
  const { data, isLoading, error } = useFamilyData(familyId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading family data</div>;

  return (
    <div className="w-full">
      <Label htmlFor="pet-select">Select Pet</Label>
      <Select
        value={selectedPetId !== null ? selectedPetId.toString() : ""}
        onValueChange={(value) =>
          onSelectPet(value === "" ? null : Number(value))
        }
        id="pet-select"
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a pet" />
        </SelectTrigger>
        <SelectContent>
          {" "}
          {/* Wrap SelectItems with SelectContent */}
          <SelectItem value="new">Insert new...</SelectItem>
          {data?.pets.map((pet) => (
            <SelectItem key={pet.id} value={pet.id.toString()}>
              {pet.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PetDropdown;
