"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import MilestoneForm from "./MilestoneForm";

interface Milestone {
  _id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: "Not Started" | "In Progress" | "Completed";
  deliverables: string[];
}

interface ProjectTimelineProps {
  projectId: string;
}

export default function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  const fetchMilestones = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/milestones`);
      if (!response.ok) throw new Error("Failed to fetch milestones");
      const data = await response.json();
      setMilestones(data);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      toast.error("Failed to load milestones");
    }
  };

  const handleMilestoneSubmit = async (
    milestoneData: Omit<Milestone, "_id">
  ) => {
    try {
      const url = editingMilestone
        ? `/api/projects/${projectId}/milestones/${editingMilestone._id}`
        : `/api/projects/${projectId}/milestones`;

      const response = await fetch(url, {
        method: editingMilestone ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(milestoneData),
      });

      if (!response.ok) throw new Error("Failed to save milestone");

      await fetchMilestones();
      setIsDialogOpen(false);
      setEditingMilestone(null);
      toast.success(
        editingMilestone
          ? "Milestone updated successfully"
          : "Milestone created successfully"
      );
    } catch (error) {
      console.error("Error saving milestone:", error);
      toast.error("Failed to save milestone");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Timeline</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMilestone(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMilestone ? "Edit Milestone" : "Add New Milestone"}
              </DialogTitle>
            </DialogHeader>
            <MilestoneForm
              initialData={editingMilestone}
              onSubmit={handleMilestoneSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingMilestone(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Milestones */}
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone._id} className="relative pl-12">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-3 w-3 h-3 rounded-full -translate-x-1.5 ${getStatusColor(
                      milestone.status
                    )}`}
                  ></div>

                  <div className="bg-card p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Due:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          milestone.status
                        )} text-white`}
                      >
                        {milestone.status}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{milestone.description}</p>
                    {milestone.deliverables.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">
                          Deliverables:
                        </h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {milestone.deliverables.map((deliverable, i) => (
                            <li key={i}>{deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
