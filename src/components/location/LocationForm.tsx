"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DatePicker from "../DatePicker";
import { Location } from "@/db/db_types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import MomentConnectionManager from "../moment/MomentConnectionManager";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Location name must be at least 2 characters.",
  }),
  map_reference: z.string().optional(),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
});

interface LocationFormValues {
  name: string;
  map_reference?: string;
  start_date: Date | null;
  end_date: Date | null;
}

interface LocationFormProps {
  locationId?: number;
  familyId: number;
  initialData?: Location;
  onFamilyChange: (familyId: number) => void;
  onDelete?: () => void;
  onSubmit: (values: LocationFormValues) => void;
  onCancel: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
  locationId,
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
      map_reference: initialData?.map_reference || "",
      start_date: initialData?.start_date || null,
      end_date: initialData?.end_date || null,
    },
  });

  const { familyData } = useFamilyDataContext();

  useEffect(() => {
    if (locationId === null) {
      form.setValue("name", "");
      form.setValue("map_reference", "");
      form.setValue("start_date", null);
      form.setValue("end_date", null);
    } else {
      form.setValue("name", initialData?.name || "");
      form.setValue("map_reference", initialData?.map_reference || "");
      form.setValue("start_date", initialData?.start_date || null);
      form.setValue("end_date", initialData?.end_date || null);
    }
  }, [locationId, familyId, initialData, form]);

  return (
    <div className="flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-lg"
        >
          <Card>
            <CardContent>
              <div className="flex items-center space-x-2">
                <FormLabel className="w-1/4">Family ID</FormLabel>
                <div className="flex-1 w-full text-left">
                  {familyId.toString()}
                </div>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="w-1/4">Location Name</FormLabel>
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Location Name"
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
                name="map_reference"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="w-1/4">Map Reference</FormLabel>
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Map Reference (optional)"
                        {...field}
                        className="w-full"
                        value={field.value || ""}
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
            </CardContent>
            <div className="border-t pt-4">
              <MomentConnectionManager
                entityId={locationId!}
                entityType="location"
                connectedMoments={
                  familyData?.moments.filter((m) =>
                    m.locations?.some((l) => l.id === locationId)
                  ) || []
                }
                availableMoments={
                  familyData?.moments.filter(
                    (m) => !m.locations?.some((l) => l.id === locationId)
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
            </div>
            <CardFooter className="flex justify-end space-x-2">
              {locationId && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this location?"
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
              <Button type="submit">{locationId ? "Update" : "Create"}</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default LocationForm;
