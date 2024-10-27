import { Metadata } from "next";
import ProjectDetails from "./ProjectDetails";
import { notFound } from "next/navigation";
import { Project } from "../ProjectsClient";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const metadata: Metadata = {
  title: "Project Details",
  description: "View and manage project details",
};

async function getProject(id: string): Promise<Project> {
  try {
    if (!ObjectId.isValid(id)) {
      notFound();
    }

    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const project = await db.collection("projects").findOne({
      _id: new ObjectId(id),
    });

    if (!project) {
      notFound();
    }

    // Transform the project data ensuring all required properties are present
    const transformedProject: Project = {
      _id: project._id.toString(),
      name: project.name,
      description: project.description,
      objective: project.objective,
      scope: project.scope,
      status: project.status,
      priority: project.priority,
      startDate: new Date(project.startDate),
      endDate: new Date(project.endDate),
      manager: project.manager,
      department: project.department,
      stakeholders: project.stakeholders,
      progress: project.progress || 0,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    };

    return transformedProject;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    notFound();
  }

  try {
    const project = await getProject(params.id);
    return <ProjectDetails initialProject={project} id={params.id} />;
  } catch (error) {
    console.error("Error loading project:", error);
    throw error;
  }
}
