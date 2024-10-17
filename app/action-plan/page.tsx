"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import ActionPlanTable from "@/components/ActionPlanTable";
import ActionPlanForm from "@/components/ActionPlanForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

export interface ActionPlan {
  _id?: string;
  service: string;
  description: string;
  actions: string;
  owner: string;
  dependency?: string;
  department: string;
  deadline: Date;
  actualCompletionDate?: Date | null;
  status: "Open" | "Ongoing" | "Closed";
  comments?: string;
}

export default function ActionPlanPage() {
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActionPlan, setEditingActionPlan] = useState<ActionPlan | null>(
    null
  );

  useEffect(() => {
    fetchActionPlans();
  }, []);

  const fetchActionPlans = async () => {
    try {
      const response = await fetch("/api/action-plans");
      if (!response.ok) {
        throw new Error("Failed to fetch action plans");
      }
      const data = await response.json();
      setActionPlans(data);
    } catch (error) {
      console.error("Error fetching action plans:", error);
      toast.error("Failed to load action plans. Please try again.");
    }
  };

  const handleAddOrUpdateActionPlan = async (actionPlan: ActionPlan) => {
    try {
      const url = actionPlan._id
        ? `/api/action-plans/${actionPlan._id}`
        : "/api/action-plans";
      const method = actionPlan._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actionPlan),
      });

      if (!response.ok) {
        throw new Error("Failed to save action plan");
      }

      const updatedActionPlan = await response.json();

      setActionPlans((prevPlans) => {
        if (actionPlan._id) {
          // Update existing action plan
          return prevPlans.map((plan) =>
            plan._id === actionPlan._id ? updatedActionPlan : plan
          );
        } else {
          // Add new action plan
          return [...prevPlans, updatedActionPlan];
        }
      });

      setIsDialogOpen(false);
      setEditingActionPlan(null);
      toast.success(
        actionPlan._id
          ? "Action plan updated successfully"
          : "Action plan added successfully"
      );
    } catch (error) {
      console.error("Error saving action plan:", error);
      toast.error("Failed to save action plan. Please try again.");
    }
  };

  const handleDeleteActionPlan = async (id: string) => {
    if (confirm("Are you sure you want to delete this action plan?")) {
      try {
        const response = await fetch(`/api/action-plans/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete action plan");
        }

        setActionPlans((prevPlans) =>
          prevPlans.filter((plan) => plan._id !== id)
        );
        toast.success("Action plan deleted successfully");
      } catch (error) {
        console.error("Error deleting action plan:", error);
        toast.error("Failed to delete action plan. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Action Plans</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingActionPlan(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Action Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {isDialogOpen && (
                  <ActionPlanForm
                    key={editingActionPlan ? editingActionPlan._id : "new"}
                    initialData={editingActionPlan}
                    onSubmit={handleAddOrUpdateActionPlan}
                    onCancel={() => {
                      setIsDialogOpen(false);
                      setEditingActionPlan(null);
                    }}
                  />
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </div>
        <ActionPlanTable
          actionPlans={actionPlans}
          onEdit={(actionPlan) => {
            setEditingActionPlan(actionPlan);
            setIsDialogOpen(true);
          }}
          onDelete={handleDeleteActionPlan}
        />
      </main>
    </div>
  );
}
