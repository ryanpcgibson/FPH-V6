import React from "react";
import { useUserFamiliesContext } from "@/context/UserFamiliesContext";
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
  const { families } = useUserFamiliesContext();

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
          {families.map((family) => (
            <SelectItem
              key={family.id}
              value={family.id.toString()}
              disabled={family.member_type === 'readonly'}
              className={family.member_type === 'readonly' ? 'opacity-50' : ''}
            >
              The {family.name} Family
              {family.member_type === 'readonly' && " (Read Only)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FamilyDropdown; 