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
  FormDescription,
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
import { useDebouncedCallback } from "use-debounce";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Pet name must be at least 2 characters.",
  }),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
  description: z.string().optional(),
  moment_connection: z.string().optional(),
});

interface PetFormValues {
  name: string;
  start_date: Date | null;
  end_date: Date | null;
}

interface PetFormProps {
  petId?: number;
  familyId: number;
  initialData?: Pet;
  onFamilyChange: (familyId: number) => void;
  onDelete?: () => void;
  onSubmit: (values: PetFormValues) => void;
  onCancel: () => void;
}

const PetForm: React.FC<PetFormProps> = ({
  petId,
  familyId,
  initialData,
  onDelete,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      start_date: initialData?.start_date || null,
      end_date: initialData?.end_date || null,
    },
  });

  const { connectMoment, disconnectMoment } = useMoments();

  const { familyData } = useFamilyDataContext();

  const debouncedUpdate = useDebouncedCallback(
    (values: Partial<z.infer<typeof formSchema>>) => {
      if (petId) {
        onSubmit({
          name: form.getValues("name"),
          start_date: form.getValues("start_date"),
          end_date: form.getValues("end_date"),
          ...values,
        });
      }
    },
    500
  );

  const handleFieldChange = (
    field: keyof z.infer<typeof formSchema>,
    value: any
  ) => {
    form.setValue(field, value);
    debouncedUpdate({ [field]: value });
  };

  useEffect(() => {
    if (petId === null) {
      form.setValue("name", "");
      form.setValue("start_date", null);
      form.setValue("end_date", null);
    } else {
      form.setValue("name", initialData?.name || "");
      form.setValue("start_date", initialData?.start_date || null);
      form.setValue("end_date", initialData?.end_date || null);
    }
  }, [petId, familyId, initialData, form]);

  return (
    <div
      className="w-full h-full flex flex-grow justify-center overflow-y-auto"
      id="pet-form-container"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-lg"
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
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
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
                        setDate={(value) =>
                          handleFieldChange("start_date", value)
                        }
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
                        setDate={(value) =>
                          handleFieldChange("end_date", value)
                        }
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
                        onChange={(e) =>
                          handleFieldChange("description", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                onConnect={(momentId) => connectMoment(momentId, petId!, "pet")}
                onDisconnect={(momentId) =>
                  disconnectMoment(momentId, petId!, "pet")
                }
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
                <Button type="button" variant="outline" onClick={onCancel}>
                Done
                </Button>
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
        </form>
      </Form>
    </div>
  );
};

export default PetForm;
