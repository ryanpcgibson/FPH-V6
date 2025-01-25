"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Moment title must be at least 2 characters.",
  }),
  body: z.string().optional(),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
});

interface MomentFormValues {
  title: string;
  body?: string;
  start_date: Date | null;
  end_date: Date | null;
}

interface MomentFormProps {
  momentId?: number;
  familyId: number;
  initialData?: Moment;
  onFamilyChange: (familyId: number) => void;
  onDelete?: () => void;
  onSubmit: (values: MomentFormValues) => void;
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      body: initialData?.body || "",
      start_date: initialData?.start_date || null,
      end_date: initialData?.end_date || null,
    },
  });

  const { familyData } = useFamilyDataContext();

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
                    <FormLabel className="w-1/4">Moment Title</FormLabel>
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Moment Title"
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
                name="body"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="w-1/4">Description</FormLabel>
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Description (optional)"
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
            <CardFooter className="flex justify-end space-x-2">
              {momentId && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this moment?"
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
              <Button type="submit">{momentId ? "Update" : "Create"}</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default MomentForm;
