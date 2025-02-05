import React from "react";
import { Trash } from "lucide-react";
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
import { useNavigate, useParams } from "react-router-dom";

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
  connectedEntities: Entity[];
  availableEntities: Entity[];
  onConnect: (entityId: number) => void;
  onDisconnect: (entityId: number) => void;
  entityType: "pet" | "location" | "moment";
}

const EntityConnectionManager: React.FC<EntityConnectionManagerProps> = ({
  control,
  name,
  label,
  connectedEntities,
  availableEntities,
  onConnect,
  onDisconnect,
  entityType,
}) => {
  const navigate = useNavigate();
  const { familyId } = useParams<{ familyId: string }>();

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
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-start space-x-2">
          <FormLabel className="w-1/4 pt-2">{label}</FormLabel>
          <FormControl className="flex-1">
            <div className="space-y-2">
              <div className="flex flex-col w-full space-y-2 pb-2">
                {connectedEntities.map((entity) => (
                  <div
                    key={entity.id}
                    className="flex items-center justify-between rounded-md border border-input bg-background px-3 text-sm ring-offset-background"
                  >
                    <span className="text-sm">
                      {getEntityDisplayName(entity)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDisconnect(entity.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              <Select
                onValueChange={(value) => {
                  if (value === "new") {
                    navigate(`/app/family/${familyId}/${entityType}/add`);
                    return;
                  }
                  const entityId = parseInt(value, 10);
                  field.onChange(entityId);
                  onConnect(entityId);
                }}
                value={field.value?.toString()}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder={`Add ${entityType}...`} />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="new">Add new {entityType}...</SelectItem>
                  {availableEntities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {getEntityDisplayName(entity)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EntityConnectionManager;
