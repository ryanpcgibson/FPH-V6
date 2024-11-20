import React from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FamilyDropdownProps {
  selectedFamilyId: number;
  onSelectFamily: (familyId: number) => void;
}

const FamilyDropdown: React.FC<FamilyDropdownProps> = ({
  selectedFamilyId,
  onSelectFamily,
}) => {
  const { families } = useFamilyDataContext();

  return (
    <div className="w-full">
      <Select
        value={selectedFamilyId.toString()}
        onValueChange={(value) => onSelectFamily(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a family" />
        </SelectTrigger>
        <SelectContent>
          {families?.map((family) => (
            <SelectItem
              key={family.id}
              value={family.id.toString()}
              disabled={family.member_type === "viewer"}
              className={family.member_type === "viewer" ? "opacity-50" : ""}
            >
              The {family.name} Family
              {family.member_type === "viewer" && " (Read Only)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FamilyDropdown;
