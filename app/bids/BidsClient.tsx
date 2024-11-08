"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  Briefcase,
  FileText,
} from "lucide-react";
import BidAlerts from "./BidAlerts";

interface Bid {
  _id?: string;
  name: string;
  service: string;
  deadline: string;
  biddingType: string;
  keyRequirements: string[];
}

export default function BidsClient() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Bid>({
    name: "",
    service: "",
    deadline: "",
    biddingType: "",
    keyRequirements: [],
  });

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const response = await fetch("/api/bids");
      if (!response.ok) {
        throw new Error("Failed to fetch bids");
      }
      const data = await response.json();
      setBids(data);
    } catch (error) {
      console.error("Error fetching bids:", error);
      toast.error("Failed to load bids. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyRequirementsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const requirements = e.target.value
      .split("\n")
      .filter((req) => req.trim() !== "");
    setFormData((prev) => ({ ...prev, keyRequirements: requirements }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = formData._id ? `/api/bids/${formData._id}` : "/api/bids";
      const method = formData._id ? "PUT" : "POST";

      const { _id, ...submitData } = formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to save bid");
      }

      await fetchBids();
      setIsDialogOpen(false);
      toast.success(
        formData._id ? "Bid updated successfully" : "Bid added successfully"
      );
      setFormData({
        name: "",
        service: "",
        deadline: "",
        biddingType: "",
        keyRequirements: [],
      });
    } catch (error) {
      console.error("Error saving bid:", error);
      toast.error("Failed to save bid. Please try again.");
    }
  };

  const handleEdit = (bid: Bid) => {
    setFormData({
      ...bid,
      deadline: new Date(bid.deadline).toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this bid?")) {
      try {
        const response = await fetch(`/api/bids/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete bid");
        }

        await fetchBids();
        toast.success("Bid deleted successfully");
      } catch (error) {
        console.error("Error deleting bid:", error);
        toast.error("Failed to delete bid. Please try again.");
      }
    }
  };

  const renderBidForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="service">Service</Label>
        <Input
          id="service"
          name="service"
          value={formData.service}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="deadline">Deadline</Label>
        <Input
          id="deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="biddingType">Bidding Type</Label>
        <Input
          id="biddingType"
          name="biddingType"
          value={formData.biddingType}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="keyRequirements">Key Requirements (one per line)</Label>
        <Textarea
          id="keyRequirements"
          name="keyRequirements"
          value={formData.keyRequirements.join("\n")}
          onChange={handleKeyRequirementsChange}
          rows={5}
        />
      </div>
      <Button type="submit">{formData._id ? "Update Bid" : "Add Bid"}</Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-primary">
                Bids Management
              </h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() =>
                      setFormData({
                        name: "",
                        service: "",
                        deadline: "",
                        biddingType: "",
                        keyRequirements: [],
                      })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Bid
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {formData._id ? "Edit Bid" : "Add New Bid"}
                    </DialogTitle>
                  </DialogHeader>
                  {renderBidForm()}
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {bids.map((bid) => (
                <Card
                  key={bid._id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-primary">
                        {bid.name}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">
                        {bid.biddingType}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="mr-2 h-4 w-4" />
                        {bid.service}
                      </p>
                      <p className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date(bid.deadline).toLocaleDateString()}
                      </p>
                      <div>
                        <h3 className="text-sm font-semibold mt-4 mb-2 flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          Key Requirements:
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                          {bid.keyRequirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(bid)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(bid._id!)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:w-[400px]">
            <BidAlerts />
          </div>
        </div>
      </main>
    </div>
  );
}
