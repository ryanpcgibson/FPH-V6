import React from "react";
import { Link2Off } from "lucide-react";

import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Label } from "@/components/ui/label";

// Entity is a generic type that can be used for pets, locations, and moments
interface Entity {
  id: number;
  name?: string;
  title?: string;
  start_date: Date;
  end_date?: Date;
}

interface EntityConnectionManagerProps {
  control: Control<any>;
  name: string;
  label: string;
  entityType: "pet" | "location" | "moment" | "photo";
  connectedEntities: Entity[];
  availableEntities: Entity[];
  onConnect: (entityId: number) => void;
  onDisconnect: (entityId: number) => void;
  onAdd?: () => void;
  returnPath?: string;
}

const EntityConnectionManager: React.FC<EntityConnectionManagerProps> = ({
  control,
  name,
  label,
  entityType,
  connectedEntities,
  availableEntities,
  onConnect,
  onDisconnect,
  onAdd,
  returnPath,
}) => {
  const navigate = useNavigate();
  const { selectedFamilyId } = useFamilyDataContext();

  const handleValueChange = (value: string) => {
    if (value === "add_new") {
      const currentPath = window.location.pathname;
      navigate(
        `/app/family/${selectedFamilyId}/${entityType}/new?returnPath=${encodeURIComponent(
          currentPath
        )}`
      );
    } else if (value !== "placeholder") {
      // Ignore the placeholder value
      onConnect(parseInt(value, 10));
    }
  };

  const getEntityDisplayName = (entity: Entity) => {
    const displayName = entity.name || entity.title || "Unnamed";
    if (entity.start_date) {
      try {
        return `${displayName} (${format(
          new Date(entity.start_date),
          "MMM d, yyyy"
        )})`;
      } catch (error) {
        return displayName;
      }
    }
    return displayName;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <Select onValueChange={handleValueChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Choose..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder">Choose...</SelectItem>
            {availableEntities.map((entity) => (
              <SelectItem key={entity.id} value={entity.id.toString()}>
                {getEntityDisplayName(entity)}
              </SelectItem>
            ))}
            {entityType === "moment" && (
              <SelectItem value="add_new">Add New Moment...</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex items-center">
            <FormLabel className="w-1/4">{label}</FormLabel>
            <FormControl className="flex-1 mb-2">
              <div className="">
                <div className="flex flex-col w-ful">
                  {connectedEntities.map((entity) => (
                    <div
                      key={entity.id}
                      className="flex items-center justify-between rounded-md border border-input bg-background px-3 text-sm ring-offset-background mb-2"
                    >
                      <span className="text-sm">
                        {getEntityDisplayName(entity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDisconnect(entity.id)}
                      >
                        <Link2Off className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default EntityConnectionManager;
