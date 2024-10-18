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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Installation {
  _id?: string;
  customerName: string;
  service: string;
  startDate: string;
  dependency: string;
  remarks: string;
  aging: number;
  status: "Open" | "Ongoing" | "Closed";
}

interface InstallationSetupFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: Installation | null;
}

export default function InstallationSetupForm({
  isOpen,
  onClose,
  editingItem,
}: InstallationSetupFormProps) {
  const [formData, setFormData] = useState<Installation>({
    customerName: "",
    service: "",
    startDate: "",
    dependency: "",
    remarks: "",
    aging: 0,
    status: "Open",
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        startDate: new Date(editingItem.startDate).toISOString().split("T")[0],
      });
    }
  }, [editingItem]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as Installation["status"],
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = editingItem
        ? `/api/installation-setup/${editingItem._id}`
        : "/api/installation-setup";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save installation");

      toast.success(
        editingItem
          ? "Installation updated successfully"
          : "Installation added successfully"
      );
      onClose();
    } catch (error) {
      console.error("Error saving installation:", error);
      toast.error("Failed to save installation");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Installation" : "Add New Installation"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="service">Service</Label>
            <Input
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="dependency">Dependency</Label>
            <Input
              id="dependency"
              name="dependency"
              value={formData.dependency}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="aging">Aging (days)</Label>
            <Input
              id="aging"
              name="aging"
              type="number"
              value={formData.aging}
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
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Save Installation
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
