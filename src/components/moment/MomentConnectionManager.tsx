// src/components/moment/MomentConnectionManager.tsx
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
import { Moment } from "@/db/db_types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMoments } from "@/hooks/useMoments";

interface MomentConnectionManagerProps {
  control: Control<any>;
  name: string;
  entityId: number;
  entityType: "pet" | "location";
  connectedMoments: Moment[];
  availableMoments: Moment[];
}

const MomentConnectionManager: React.FC<MomentConnectionManagerProps> = ({
  control,
  name,
  entityId,
  entityType,
  connectedMoments,
  availableMoments,
}) => {
  const navigate = useNavigate();
  const { familyId } = useParams<{ familyId: string }>();
  const { connectMoment, disconnectMoment } = useMoments();

  const handleRemoveConnection = async (momentId: number) => {
    if (
      window.confirm(
        `Are you sure you want to remove this moment from the ${entityType}?`
      )
    ) {
      try {
        await disconnectMoment(momentId, entityId, entityType);
      } catch (error) {
        console.error("Error removing moment connection:", error);
      }
    }
  };

  const handleAddConnection = async (momentId: string) => {
    if (momentId === "new") {
      navigate(`/app/family/${familyId}/moment/add`);
      return;
    }

    try {
      await connectMoment(parseInt(momentId, 10), entityId, entityType);
    } catch (error) {
      console.error("Error adding moment connection:", error);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-start space-x-2">
          <FormLabel className="w-1/4 pt-2">Moments</FormLabel>
          <FormControl className="flex-1">
            <div className="space-y-2">
              <div className="flex flex-col w-full space-y-2 pb-2">
                {connectedMoments.map((moment) => (
                  <div
                    key={moment.id}
                    className="flex items-center justify-between rounded-md border border-input bg-background px-3 text-sm ring-offset-background"
                  >
                    <span className="text-sm">
                      {moment.title} (
                      {format(moment.start_date!, "MMM d, yyyy")})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveConnection(moment.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleAddConnection(value);
                }}
                value={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add moment connection..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Create new moment...</SelectItem>
                  {availableMoments.map((moment) => (
                    <SelectItem key={moment.id} value={moment.id.toString()}>
                      {moment.title} (
                      {format(moment.start_date!, "MMM d, yyyy")})
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

export default MomentConnectionManager;
