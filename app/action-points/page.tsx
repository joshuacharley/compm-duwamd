"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import ActionPointList from "@/components/ActionPointList";
import ActionPointForm from "@/components/ActionPointForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ActionPointsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActionPoint, setEditingActionPoint] = useState(null);

  const handleAddNew = () => {
    setEditingActionPoint(null);
    setIsFormOpen(true);
  };

  const handleEdit = (actionPoint: any) => {
    setEditingActionPoint(actionPoint);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingActionPoint(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4 text-gradient">
            Action Points
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            onClick={handleAddNew}
            className="mb-4 bg-brand-orange hover:bg-brand-orange/90 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Action Point
          </Button>
        </motion.div>
        <ActionPointList onEdit={handleEdit} />
        {isFormOpen && (
          <ActionPointForm
            isOpen={isFormOpen}
            onClose={handleFormClose}
            editingActionPoint={editingActionPoint}
          />
        )}
      </main>
    </div>
  );
}
