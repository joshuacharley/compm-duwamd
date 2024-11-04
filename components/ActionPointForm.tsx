"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface ActionPoint {
  _id?: string;
  topic: string;
  description: string;
  processingDate: string;
  responsibility: string;
  expectedClosingDate: string;
  status: "Pending" | "In Progress" | "Completed";
}

interface ActionPointFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingActionPoint: ActionPoint | null;
}

export default function ActionPointForm({
  isOpen,
  onClose,
  editingActionPoint,
}: ActionPointFormProps) {
  const [formData, setFormData] = useState<ActionPoint>({
    topic: "",
    description: "",
    processingDate: "",
    responsibility: "",
    expectedClosingDate: "",
    status: "Pending",
  });

  useEffect(() => {
    if (editingActionPoint) {
      setFormData({
        ...editingActionPoint,
        processingDate: new Date(editingActionPoint.processingDate)
          .toISOString()
          .split("T")[0],
        expectedClosingDate: new Date(editingActionPoint.expectedClosingDate)
          .toISOString()
          .split("T")[0],
      });
    }
  }, [editingActionPoint]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as ActionPoint["status"],
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = editingActionPoint
        ? `/api/action-points/${editingActionPoint._id}`
        : "/api/action-points";
      const method = editingActionPoint ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save action point");

      toast.success(
        editingActionPoint
          ? "Action point updated successfully"
          : "Action point added successfully"
      );
      onClose();
    } catch (error) {
      console.error("Error saving action point:", error);
      toast.error("Failed to save action point");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {editingActionPoint ? "Edit Action Point" : "Add New Action Point"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4 pr-4">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="processingDate">Processing Date</Label>
              <Input
                id="processingDate"
                name="processingDate"
                type="date"
                value={formData.processingDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="responsibility">Responsibility</Label>
              <Input
                id="responsibility"
                name="responsibility"
                value={formData.responsibility}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="expectedClosingDate">Expected Closing Date</Label>
              <Input
                id="expectedClosingDate"
                name="expectedClosingDate"
                type="date"
                value={formData.expectedClosingDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Save Action Point
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
