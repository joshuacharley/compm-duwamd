"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
// > 3 | import { emitUpdate } from "@/lib/socketio";

interface ActionPoint {
  _id: string;
  topic: string;
  description: string;
  processingDate: string;
  responsibility: string;
  expectedClosingDate: string;
  status: "Pending" | "In Progress" | "Completed";
}

interface ActionPointListProps {
  onEdit: (actionPoint: ActionPoint) => void;
}

export default function ActionPointList({ onEdit }: ActionPointListProps) {
  const [actionPoints, setActionPoints] = useState<ActionPoint[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchActionPoints();
  }, []);

  const fetchActionPoints = async () => {
    try {
      const response = await fetch("/api/action-points");
      if (!response.ok) throw new Error("Failed to fetch action points");
      const data: ActionPoint[] = await response.json();
      setActionPoints(data);
    } catch (error) {
      console.error("Error fetching action points:", error);
      toast.error("Failed to load action points");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this action point?")) {
      try {
        const response = await fetch(`/api/action-points/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete action point");
        toast.success("Action point deleted successfully");
        fetchActionPoints();
      } catch (error) {
        console.error("Error deleting action point:", error);
        toast.error("Failed to delete action point");
      }
    }
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Responsibility</TableHead>
            <TableHead>Processing Date</TableHead>
            <TableHead>Expected Closing Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {actionPoints.map((actionPoint) => (
              <>
                <motion.tr
                  key={actionPoint._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(actionPoint._id)}
                    >
                      {expandedRows[actionPoint._id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{actionPoint.topic}</TableCell>
                  <TableCell>{actionPoint.responsibility}</TableCell>
                  <TableCell>
                    {new Date(actionPoint.processingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      actionPoint.expectedClosingDate
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        actionPoint.status === "Completed"
                          ? "success"
                          : actionPoint.status === "In Progress"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {actionPoint.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(actionPoint)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(actionPoint._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
                <AnimatePresence>
                  {expandedRows[actionPoint._id] && (
                    <motion.tr
                      key={`${actionPoint._id}-expanded`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell colSpan={7}>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <h4 className="font-semibold mb-2">Description:</h4>
                          <p>{actionPoint.description}</p>
                        </div>
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
