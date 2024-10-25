"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import ProjectOverview from "@/components/project/ProjectOverview";
import TaskManagement from "@/components/project/TaskManagement";
import ProjectTimeline from "@/components/project/ProjectTimeline";
import StatusUpdates from "@/components/project/StatusUpdates";
import ProjectFiles from "@/components/project/ProjectFiles";
import ProjectCommunication from "@/components/project/ProjectCommunication";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "../ProjectsClient";
import { toast } from "sonner";

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      const data = await response.json();
      setProject(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to load project details");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto mt-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto mt-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Project not found</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ProjectOverview project={project} />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManagement projectId={project._id} />
          </TabsContent>

          <TabsContent value="timeline">
            <ProjectTimeline projectId={project._id} />
          </TabsContent>

          <TabsContent value="status">
            <StatusUpdates projectId={project._id} />
          </TabsContent>

          <TabsContent value="files">
            <ProjectFiles projectId={project._id} />
          </TabsContent>

          <TabsContent value="communication">
            <ProjectCommunication projectId={project._id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}