"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Target, Briefcase } from "lucide-react";
import { Project } from "@/app/projects/ProjectsClient";

interface ProjectOverviewProps {
  project: Project;
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="mt-2">{project.status}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Project Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4" />
              <span>{project.manager}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <Briefcase className="mr-2 h-4 w-4" />
              <span>{project.department}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Objective</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{project.objective}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{project.scope}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stakeholders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {project.stakeholders.map((stakeholder, index) => (
              <Badge key={index} variant="secondary">
                {stakeholder}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
