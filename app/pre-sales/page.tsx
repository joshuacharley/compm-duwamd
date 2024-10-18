"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { toast } from "sonner";
import PipelineProjects from "@/components/PipelineProjects";
import ActivityReport from "@/components/ActivityReport";
import { IActivityReport } from "@/models/ActivityReport";

export default function PreSalesPage() {
  const fetchActivityReports = async () => {
    try {
      const response = await fetch("/api/activity-reports");
      if (!response.ok) {
        throw new Error("Failed to fetch activity reports");
      }
      const data = await response.json();
      return data as IActivityReport[];
    } catch (error) {
      console.error("Error fetching activity reports:", error);
      toast.error("Failed to load activity reports");
      return [];
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

        <ActivityReport fetchActivityReports={fetchActivityReports} />
      </main>
    </div>
  );
}
