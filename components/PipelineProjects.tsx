import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  ChevronDown,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";

interface PipelineProject {
  _id: string;
  projectId: number;
  customerName: string;
  service: string;
  numberOfLinks: number;
  bandwidth: string;
  contractTerms: string;
  oneOffCost: number;
  monthlyCost: number;
  dealWorth: number;
  responsibility: string;
  department: string;
  status: "Open" | "Ongoing" | "Closed";
  comments: string;
  requestDate: string;
  expectedClosureDate: string;
}

const PipelineProjects: React.FC = () => {
  const [projects, setProjects] = useState<PipelineProject[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<PipelineProject>>({});
  const [editingProject, setEditingProject] = useState<PipelineProject | null>(
    null
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/pipeline-projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    }
  };

  const handleAddProject = async () => {
    try {
      const response = await fetch("/api/pipeline-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Failed to add project");
      }

      const addedProject = await response.json();
      setProjects([...projects, addedProject]);
      setNewProject({});
      setIsAddDialogOpen(false);
      toast.success("Project added successfully");
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    }
  };

  const handleEditProject = async () => {
    if (!editingProject) return;

    try {
      const response = await fetch(
        `/api/pipeline-projects/${editingProject._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingProject),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      const updatedProject = await response.json();
      setProjects(
        projects.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );
      setEditingProject(null);
      toast.success("Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/pipeline-projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const renderFormFields = (
    project: Partial<PipelineProject>,
    setProject: React.Dispatch<React.SetStateAction<any>>
  ) => (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-4 pr-4">
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            value={project.customerName || ""}
            onChange={(e) =>
              setProject({ ...project, customerName: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="service">Service</Label>
          <Input
            id="service"
            value={project.service || ""}
            onChange={(e) =>
              setProject({ ...project, service: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="numberOfLinks">Number of Links</Label>
          <Input
            id="numberOfLinks"
            type="number"
            value={project.numberOfLinks || ""}
            onChange={(e) =>
              setProject({
                ...project,
                numberOfLinks: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="bandwidth">Bandwidth</Label>
          <Input
            id="bandwidth"
            value={project.bandwidth || ""}
            onChange={(e) =>
              setProject({ ...project, bandwidth: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="contractTerms">Contract Terms</Label>
          <Input
            id="contractTerms"
            value={project.contractTerms || ""}
            onChange={(e) =>
              setProject({ ...project, contractTerms: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="oneOffCost">One-off Cost</Label>
          <Input
            id="oneOffCost"
            type="number"
            value={project.oneOffCost || ""}
            onChange={(e) =>
              setProject({ ...project, oneOffCost: parseFloat(e.target.value) })
            }
          />
        </div>
        <div>
          <Label htmlFor="monthlyCost">Monthly Cost</Label>
          <Input
            id="monthlyCost"
            type="number"
            value={project.monthlyCost || ""}
            onChange={(e) =>
              setProject({
                ...project,
                monthlyCost: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="dealWorth">Deal Worth</Label>
          <Input
            id="dealWorth"
            type="number"
            value={project.dealWorth || ""}
            onChange={(e) =>
              setProject({ ...project, dealWorth: parseFloat(e.target.value) })
            }
          />
        </div>
        <div>
          <Label htmlFor="responsibility">Responsibility</Label>
          <Input
            id="responsibility"
            value={project.responsibility || ""}
            onChange={(e) =>
              setProject({ ...project, responsibility: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={project.department || ""}
            onChange={(e) =>
              setProject({ ...project, department: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={project.status || ""}
            onValueChange={(value) => setProject({ ...project, status: value })}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="comments">Comments</Label>
          <Input
            id="comments"
            value={project.comments || ""}
            onChange={(e) =>
              setProject({ ...project, comments: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="requestDate">Request Date</Label>
          <Input
            id="requestDate"
            type="date"
            value={
              project.requestDate
                ? new Date(project.requestDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setProject({ ...project, requestDate: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="expectedClosureDate">Expected Closure Date</Label>
          <Input
            id="expectedClosureDate"
            type="date"
            value={
              project.expectedClosureDate
                ? new Date(project.expectedClosureDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) =>
              setProject({ ...project, expectedClosureDate: e.target.value })
            }
          />
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <Card className="mt-8 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardTitle className="text-2xl font-bold">Pipeline Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Add New Pipeline Project
                </DialogTitle>
              </DialogHeader>
              {renderFormFields(newProject, setNewProject)}
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleAddProject}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Add Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {projects.map((project) => (
            <AccordionItem
              key={project._id}
              value={project._id}
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2">
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold">
                    {project.customerName} - {project.service}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        project.status === "Open"
                          ? "bg-green-200 text-green-800"
                          : project.status === "Ongoing"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {project.status}
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-b-md">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Links:</span>{" "}
                      {project.numberOfLinks}
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Deal Worth:</span> $
                      {project.dealWorth.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Request Date:</span>{" "}
                      {new Date(project.requestDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Responsibility:</span>{" "}
                      {project.responsibility}
                    </div>
                  </div>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Bandwidth</TableCell>
                        <TableCell>{project.bandwidth}</TableCell>
                        <TableCell className="font-medium">
                          Contract Terms
                        </TableCell>
                        <TableCell>{project.contractTerms}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          One-off Cost
                        </TableCell>
                        <TableCell>
                          ${project.oneOffCost.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          Monthly Cost
                        </TableCell>
                        <TableCell>
                          ${project.monthlyCost.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Department
                        </TableCell>
                        <TableCell>{project.department}</TableCell>
                        <TableCell className="font-medium">
                          Expected Closure
                        </TableCell>
                        <TableCell>
                          {new Date(
                            project.expectedClosureDate
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Comments</TableCell>
                        <TableCell colSpan={3}>{project.comments}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingProject(project);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">
                            Edit Pipeline Project
                          </DialogTitle>
                        </DialogHeader>
                        {editingProject &&
                          renderFormFields(editingProject, setEditingProject)}
                        <div className="mt-6 flex justify-end">
                          <Button
                            onClick={handleEditProject}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Update Project
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteProject(project._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete this project</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PipelineProjects;
