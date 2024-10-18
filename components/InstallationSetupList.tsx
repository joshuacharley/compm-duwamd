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

interface Installation {
  _id: string;
  customerName: string;
  service: string;
  startDate: string;
  dependency: string;
  remarks: string;
  aging: number;
  status: "Open" | "Ongoing" | "Closed";
}

interface InstallationSetupListProps {
  onEdit: (installation: Installation) => void;
}

export default function InstallationSetupList({
  onEdit,
}: InstallationSetupListProps) {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchInstallations();
  }, []);

  const fetchInstallations = async () => {
    try {
      const response = await fetch("/api/installation-setup");
      if (!response.ok) throw new Error("Failed to fetch installations");
      const data: Installation[] = await response.json();
      setInstallations(data);
    } catch (error) {
      console.error("Error fetching installations:", error);
      toast.error("Failed to load installations");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this installation?")) {
      try {
        const response = await fetch(`/api/installation-setup/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete installation");
        toast.success("Installation deleted successfully");
        fetchInstallations();
      } catch (error) {
        console.error("Error deleting installation:", error);
        toast.error("Failed to delete installation");
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
            <TableHead>Customer Name</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Dependency</TableHead>
            <TableHead>Aging (days)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {installations.map((install) => (
              <>
                <motion.tr
                  key={install._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(install._id)}
                    >
                      {expandedRows[install._id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{install.customerName}</TableCell>
                  <TableCell>{install.service}</TableCell>
                  <TableCell>
                    {new Date(install.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{install.dependency}</TableCell>
                  <TableCell>{install.aging}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        install.status === "Ongoing" ? "default" : "secondary"
                      }
                    >
                      {install.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(install)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(install._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
                <AnimatePresence>
                  {expandedRows[install._id] && (
                    <motion.tr
                      key={`${install._id}-expanded`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell colSpan={8}>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <h4 className="font-semibold mb-2">Remarks:</h4>
                          <p>{install.remarks}</p>
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
