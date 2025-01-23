"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DatePicker from "../DatePicker";
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
import MomentConnectionManager from "../moment/MomentConnectionManager";
import { useFamilyDataContext } from "@/context/FamilyDataContext";

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
  onFamilyChange,
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

  const { familyData } = useFamilyDataContext();

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
    <div className="flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-lg"
        >
          <Card>
            <CardContent>
              <div className="flex items-center space-x-2" />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="w-1/4">Pet Name</FormLabel>
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Pet Name"
                        {...field}
                        className="w-full"
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
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="w-1/4">Start Date</FormLabel>
                    <FormControl className="flex-1">
                      <DatePicker
                        date={field.value}
                        setDate={(date) => field.onChange(date)}
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
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="w-1/4">End Date</FormLabel>
                    <FormControl className="flex-1">
                      <DatePicker
                        date={field.value}
                        setDate={(date) => field.onChange(date)}
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
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="w-1/4">Description</FormLabel>
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Pet description (optional)"
                        {...field}
                        className="w-full"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <MomentConnectionManager
                control={form.control}
                name="moment_connection"
                entityId={petId!}
                entityType="pet"
                connectedMoments={
                  familyData?.moments.filter((m) =>
                    m.pets.some((p) => p.id === petId)
                  ) || []
                }
                availableMoments={
                  familyData?.moments.filter(
                    (m) => !m.pets.some((p) => p.id === petId)
                  ) || []
                }
                onRemoveConnection={(momentId) => {
                  // TODO: Implement moment connection removal
                  console.log("Remove connection", momentId);
                }}
                onAddConnection={(momentId) => {
                  // TODO: Implement moment connection addition
                  console.log("Add connection", momentId);
                }}
                onCreateNewMoment={() => {
                  // TODO: Navigate to new moment form
                  console.log("Create new moment");
                }}
              />
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
              {petId && (
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
              )}
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">{petId ? "Update" : "Create"}</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default PetForm;
