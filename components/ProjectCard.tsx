"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Clock } from "lucide-react";
import { Project } from "@/app/projects/ProjectsClient";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const statusColors = {
  "Not Started": "bg-gray-500",
  "In Progress": "bg-blue-500",
  Completed: "bg-green-500",
  "On Hold": "bg-yellow-500",
};

const priorityColors = {
  Low: "bg-blue-200 text-blue-700",
  Medium: "bg-yellow-200 text-yellow-700",
  High: "bg-red-200 text-red-700",
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
          <Badge className={priorityColors[project.priority]}>
            {project.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
            <Badge
              variant="outline"
              className={`${statusColors[project.status]} text-white`}
            >
              {project.status}
            </Badge>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              <span>{project.stakeholders?.length || 0} stakeholders</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>{project.department}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
