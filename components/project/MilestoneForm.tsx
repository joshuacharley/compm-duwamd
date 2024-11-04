"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const milestoneSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.date(),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
  deliverables: z.array(z.string()),
});

type MilestoneFormData = z.infer<typeof milestoneSchema>;

interface MilestoneFormProps {
  initialData?: MilestoneFormData | null;
  onSubmit: (data: MilestoneFormData) => void;
  onCancel: () => void;
}

export default function MilestoneForm({
  initialData,
  onSubmit,
  onCancel,
}: MilestoneFormProps) {
  const form = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      dueDate: new Date(),
      status: "Not Started",
      deliverables: [],
    },
  });

  const [newDeliverable, setNewDeliverable] = useState("");

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      const currentDeliverables = form.getValues("deliverables");
      form.setValue("deliverables", [
        ...currentDeliverables,
        newDeliverable.trim(),
      ]);
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (index: number) => {
    const currentDeliverables = form.getValues("deliverables");
    form.setValue(
      "deliverables",
      currentDeliverables.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-full pl-3 text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliverables"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deliverables</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  placeholder="Add deliverable"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDeliverable();
                    }
                  }}
                />
                <Button type="button" onClick={addDeliverable}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {field.value.map((deliverable, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {deliverable}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeDeliverable(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Milestone" : "Create Milestone"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
