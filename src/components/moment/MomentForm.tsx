"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DatePicker from "../DatePicker";
import { Moment } from "@/db/db_types";
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
import EntityConnectionManager from "../EntityConnectionManager";
import { useMoments } from "@/hooks/useMoments";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().optional(),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
  pet_connection: z.string().optional(),
  location_connection: z.string().optional(),
});

interface MomentFormProps {
  momentId?: number;
  familyId: number;
  initialData?: Moment;
  onFamilyChange: (familyId: number) => void;
  onDelete?: () => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

const MomentForm: React.FC<MomentFormProps> = ({
  momentId,
  familyId,
  initialData,
  onFamilyChange,
  onDelete,
  onSubmit,
  onCancel,
}) => {
  const { familyData } = useFamilyDataContext();
  const { connectPet, disconnectPet, connectLocation, disconnectLocation } =
    useMoments();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      body: initialData?.body ?? "",
      start_date: initialData?.start_date ?? null,
      end_date: initialData?.end_date ?? null,
    },
  });

  useEffect(() => {
    if (momentId === null) {
      form.setValue("title", "");
      form.setValue("body", "");
      form.setValue("start_date", null);
      form.setValue("end_date", null);
    } else {
      form.setValue("title", initialData?.title || "");
      form.setValue("body", initialData?.body || "");
      form.setValue("start_date", initialData?.start_date || null);
      form.setValue("end_date", initialData?.end_date || null);
    }
  }, [momentId, familyId, initialData, form]);

  const handleConnectPet = async (petId: number) => {
    if (momentId) {
      await connectPet(momentId, petId);
    }
  };

  const handleDisconnectPet = async (petId: number) => {
    if (momentId) {
      await disconnectPet(momentId, petId);
    }
  };

  const handleConnectLocation = async (locationId: number) => {
    if (momentId) {
      await connectLocation(momentId, locationId);
    }
  };

  const handleDisconnectLocation = async (locationId: number) => {
    if (momentId) {
      await disconnectLocation(momentId, locationId);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{momentId ? "Edit Moment" : "New Moment"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
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
                  <FormItem className="flex-1">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <EntityConnectionManager
              control={form.control}
              name="pet_connection"
              label="Connected Pets"
              entityType="pet"
              connectedEntities={initialData?.pets || []}
              availableEntities={
                familyData?.pets.filter(
                  (p) => !initialData?.pets?.some((mp) => mp.id === p.id)
                ) || []
              }
              onConnect={handleConnectPet}
              onDisconnect={handleDisconnectPet}
            />

            <EntityConnectionManager
              control={form.control}
              name="location_connection"
              label="Connected Locations"
              entityType="location"
              connectedEntities={initialData?.locations || []}
              availableEntities={
                familyData?.locations.filter(
                  (l) => !initialData?.locations?.some((ml) => ml.id === l.id)
                ) || []
              }
              onConnect={handleConnectLocation}
              onDisconnect={handleDisconnectLocation}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <div>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
            <div className="flex gap-2">
              {momentId && onDelete && (
                <Button type="button" variant="destructive" onClick={onDelete}>
                  Delete
                </Button>
              )}
              <Button type="submit">Save</Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default MomentForm;
