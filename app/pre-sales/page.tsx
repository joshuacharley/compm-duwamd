"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, parseISO, isValid } from "date-fns";
import PipelineProjects from "@/components/PipelineProjects";
import ActivityReport from "@/components/ActivityReport";

export default function PreSalesPage() {
  const [activityReport, setActivityReport] = useState({
    informationSharing: [],
    workedWell: [],
    difficulties: [],
    alignmentRequest: [],
  });

  useEffect(() => {
    fetchActivityReport();
  }, []);

  const fetchActivityReport = async () => {
    try {
      const response = await fetch("/api/activity-reports");
      if (!response.ok) {
        throw new Error("Failed to fetch activity report");
      }
      const data = await response.json();
      setActivityReport(data);
    } catch (error) {
      console.error("Error fetching activity report:", error);
      toast.error("Failed to load activity report");
    }
  };

  const updateActivityReport = async (updatedReport: any) => {
    try {
      const response = await fetch("/api/activity-reports", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedReport),
      });

      if (!response.ok) {
        throw new Error("Failed to update activity report");
      }

      setActivityReport(updatedReport);
      toast.success("Activity report updated successfully");
    } catch (error) {
      console.error("Error updating activity report:", error);
      toast.error("Failed to update activity report");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900">
      <Header />
      <main className="container mx-auto mt-8 px-4 pb-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800 dark:text-indigo-200">
          B2B Weekly Report - Pre-sales
        </h1>

        <PipelineProjects />

        <ActivityReport
          activityReport={activityReport}
          updateActivityReport={updateActivityReport}
        />
      </main>
    </div>
  );
}
