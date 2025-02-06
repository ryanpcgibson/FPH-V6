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
import UploadForm from "@/components/UploadForm";

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
  onDelete,
  onSubmit,
  onCancel,
}) => {
  console.log("MomentForm", {
    momentId,
    familyId,
    initialData,
  });
  const { familyData } = useFamilyDataContext();
  const { connectMoment, disconnectMoment } = useMoments();

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
      form.setValue("start_date", initialData?.start_date || null); // TODO: convert to string?
      form.setValue("end_date", initialData?.end_date || null); // TODO: convert to string?
    }
  }, [momentId, familyId, initialData, form]);

  const handleConnectPet = async (petId: number) => {
    if (momentId) {
      await connectMoment(momentId, petId, "pet");
    }
  };

  const handleDisconnectPet = async (petId: number) => {
    if (momentId) {
      await disconnectMoment(momentId, petId, "pet");
    }
  };

  const handleConnectLocation = async (locationId: number) => {
    if (momentId) {
      await connectMoment(momentId, locationId, "location");
    }
  };

  const handleDisconnectLocation = async (locationId: number) => {
    if (momentId) {
      await disconnectMoment(momentId, locationId, "location");
    }
  };

  return (
    <div className="flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-lg"
        >
          <Card>
            <CardContent className="space-y-2 pt-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="w-1/4">Title</FormLabel>
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Title"
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
                name="body"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="w-1/4">Description</FormLabel>
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Description (optional)"
                        {...field}
                        className="w-full bg-background"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
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
              </div>

              <EntityConnectionManager
                control={form.control}
                name="pet_connection"
                label="Pets"
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
                label="Locations"
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
              <EntityConnectionManager
                control={form.control}
                name="photo_connection"
                label="Photos"
                entityType="photo"
                connectedEntities={initialData?.photos || []}
                availableEntities={[]}
                onConnect={() => {}}
                onDisconnect={() => {}}
              />
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
              {momentId && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this moment?"
                      )
                    ) {
                      onDelete();
                    }
                  }}
                >
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">{momentId ? "Update" : "Create"}</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default MomentForm;
