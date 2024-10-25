"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import InstallationSetupList from "@/components/InstallationSetupList";
import InstallationSetupForm from "@/components/InstallationSetupForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function InstallationSetupPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
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
            Installation and Setup List
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
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Installation
          </Button>
        </motion.div>
        <InstallationSetupList onEdit={handleEdit} />
        {isFormOpen && (
          <InstallationSetupForm
            isOpen={isFormOpen}
            onClose={handleFormClose}
            editingItem={editingItem}
          />
        )}
      </main>
    </div>
  );
}
