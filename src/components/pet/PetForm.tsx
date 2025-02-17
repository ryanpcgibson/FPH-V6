import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pet } from "../../db/db_types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EntityConnectionManager from "@/components/EntityConnectionManager";
import { useMoments } from "@/hooks/useMoments";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import DatePickerWithInput from "../DatePickerWithInput";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Pet name must be at least 2 characters.",
  }),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
  description: z.string().optional(),
  moment_connection: z.string().optional(),
});

export interface PetFormValues {
  name: string;
  family_id: number;
  start_date: Date;
  end_date: Date | undefined;
  description: string;
}

interface PetFormProps {
  petId?: number;
  initialData?: Pet;
  onDelete?: () => void;
  onSubmit: (values: PetFormValues) => void;
  onCancel: () => void;
}

const PetForm: React.FC<PetFormProps> = ({
  petId,
  initialData,
  onDelete,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<PetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      start_date: initialData?.start_date
        ? new Date(initialData.start_date)
        : undefined,
      end_date: initialData?.end_date
        ? new Date(initialData.end_date)
        : undefined,
      description: initialData?.description || "",
    },
  });

  const { familyData } = useFamilyDataContext();

  // Check if any non-moment fields are dirty
  const isFormDirty = Object.keys(form.formState.dirtyFields).some(
    (field) => field !== "moment_connection"
  );

  const { connectMoment, disconnectMoment } = useMoments();

  const handleMomentConnect = async (momentId: number) => {
    if (petId) {
      await connectMoment(momentId, petId, "pet");
    }
  };

  const handleMomentDisconnect = async (momentId: number) => {
    if (petId) {
      await disconnectMoment(momentId, petId, "pet");
    }
  };

  useEffect(() => {
    // Reset form when initialData changes
    form.reset({
      name: initialData?.name || "",
      start_date: initialData?.start_date
        ? new Date(initialData.start_date)
        : undefined,
      end_date: initialData?.end_date
        ? new Date(initialData.end_date)
        : undefined,
      description: initialData?.description || "",
    });
  }, [initialData, form]);

  return (
    <div
      className="w-full h-full flex flex-grow justify-center overflow-y-auto"
      id="pet-form-container"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full max-w-lg"
        >
          <Card>
            <CardContent className="p-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="w-1/4">Pet Name</FormLabel>
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Pet Name"
                        {...field}
                        className="w-full bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="w-1/4">Start Date</FormLabel>
                    <FormControl>
                      <DatePickerWithInput
                        date={field.value}
                        setDate={(value) => field.onChange(value)}
                        required={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex items-center ">
                    <FormLabel className="w-1/4">End Date</FormLabel>
                    <FormControl>
                      <DatePickerWithInput
                        date={field.value}
                        setDate={(value) => field.onChange(value)}
                        required={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex items-center ">
                    <FormLabel className="w-1/4">Description</FormLabel>
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Pet description (optional)"
                        {...field}
                        className="w-full bg-background"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-between gap-2 p-3">
              {petId ? (
                <>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this pet?"
                        )
                      ) {
                        onDelete?.();
                      }
                    }}
                  >
                    Delete
                  </Button>
                  {isFormDirty ? (
                    <Button type="submit" variant="default">
                      Save
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Done
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button variant="outline" type="submit">
                    Create
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>

          {petId && (
            <Card className="mt-2">
              <CardContent className="p-3">
                <EntityConnectionManager
                  control={form.control}
                  name="moment_connection"
                  label="Moments"
                  entityType="moment"
                  connectedEntities={
                    familyData?.moments?.filter((m) =>
                      m.pets?.some((p) => p.id === petId)
                    ) || []
                  }
                  availableEntities={
                    familyData?.moments.filter(
                      (m) => !m.pets?.some((p) => p.id === petId)
                    ) || []
                  }
                  onConnect={handleMomentConnect}
                  onDisconnect={handleMomentDisconnect}
                />
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
};

export default PetForm;
