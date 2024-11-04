"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import TaskForm, { TaskFormData } from "@/components/TaskForm";

interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Not Started" | "In Progress" | "Completed";
}

export default function TasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData: TaskFormData) => {
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate.toISOString(),
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error("Failed to create task");

      await fetchTasks();
      setIsDialogOpen(false);
      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (formData: TaskFormData) => {
    if (!editingTask?._id) return;

    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate.toISOString(),
      };

      const response = await fetch(`/api/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error("Failed to update task");

      await fetchTasks();
      setIsDialogOpen(false);
      setEditingTask(null);
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      await fetchTasks();
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const getFormDataFromTask = (task: Task): TaskFormData => ({
    title: task.title,
    description: task.description || "",
    assignedTo: task.assignedTo,
    dueDate: new Date(task.dueDate), // Ensure proper date conversion
    priority: task.priority,
    status: task.status,
  });

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const priorityColors = {
    Low: "bg-blue-100 text-blue-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
  };

  const statusColors = {
    "Not Started": "bg-gray-100 text-gray-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Manage and track all tasks</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTask(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? "Edit Task" : "Create New Task"}
                </DialogTitle>
              </DialogHeader>
              <TaskForm
                initialData={
                  editingTask ? getFormDataFromTask(editingTask) : undefined
                }
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingTask(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>
                  {new Date(task.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge className={priorityColors[task.priority]}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[task.status]}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingTask(task);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No tasks found</h2>
            <p className="text-muted-foreground">
              {searchTerm
                ? "No tasks match your search criteria"
                : "Start by creating your first task"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
