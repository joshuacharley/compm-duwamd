import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { ActionPlan } from "@/app/action-plan/page";
import { motion, AnimatePresence } from "framer-motion";

interface ActionPlanTableProps {
  actionPlans: ActionPlan[];
  onEdit: (actionPlan: ActionPlan) => void;
  onDelete: (id: string) => void;
}

const ActionPlanTable: React.FC<ActionPlanTableProps> = ({
  actionPlans,
  onEdit,
  onDelete,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {actionPlans.map((plan) => (
          <React.Fragment key={plan._id}>
            <TableRow>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRow(plan._id!)}
                >
                  {expandedRows.has(plan._id!) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
              <TableCell>{plan.service}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>{plan.owner}</TableCell>
              <TableCell>
                {new Date(plan.deadline).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    plan.status === "Closed"
                      ? "secondary"
                      : plan.status === "Ongoing"
                      ? "default"
                      : "outline"
                  }
                >
                  {plan.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(plan._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <AnimatePresence>
              {expandedRows.has(plan._id!) && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-muted p-4 rounded-md"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold">Actions:</h4>
                          <p>{plan.actions}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Dependency:</h4>
                          <p>{plan.dependency || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Department:</h4>
                          <p>{plan.department}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            Actual Completion Date:
                          </h4>
                          <p>
                            {plan.actualCompletionDate
                              ? new Date(
                                  plan.actualCompletionDate
                                ).toLocaleDateString()
                              : "Not completed"}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <h4 className="font-semibold">Comments:</h4>
                          <p>{plan.comments || "No comments"}</p>
                        </div>
                      </div>
                    </motion.div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default ActionPlanTable;
