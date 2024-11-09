"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BeakerIcon, Loader2 } from "lucide-react";

const TEST_SOURCES = [
  "Ministry of Finance",
  "Ministry of Works",
  "Ministry of Health",
  "Ministry of Education",
  "Local Government",
  "NPPA",
  "TendersInfo",
];

const TEST_CATEGORIES = [
  {
    value: "Communication",
    services: ["mobile", "postpaid", "prepaid", "cug"],
  },
  {
    value: "Connectivity",
    services: ["internet", "vpn", "speedbox", "airbox"],
  },
  {
    value: "Collaboration",
    services: ["sms", "toll-free", "short-code", "ussd"],
  },
  {
    value: "ICT",
    services: ["security", "networking", "cloud", "infrastructure"],
  },
];

export default function TestPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testBid, setTestBid] = useState({
    source: TEST_SOURCES[0],
    title: "",
    description: "",
    url: "",
    bidCategory: TEST_CATEGORIES[0].value,
    services: [],
    closingDate: "",
  });

  const handleServiceToggle = (service: string) => {
    setTestBid((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmitTest = async () => {
    if (!testBid.title || !testBid.url) {
      toast.error("Title and URL are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/bid-alerts/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...testBid,
          publishDate: new Date(),
          closingDate: testBid.closingDate
            ? new Date(testBid.closingDate)
            : undefined,
          notified: false,
        }),
      });

      if (!response.ok) throw new Error("Failed to create test bid alert");

      toast.success("Test bid alert created successfully");
      setTestBid({
        source: TEST_SOURCES[0],
        title: "",
        description: "",
        url: "",
        bidCategory: TEST_CATEGORIES[0].value,
        services: [],
        closingDate: "",
      });
    } catch (error) {
      console.error("Error creating test bid:", error);
      toast.error("Failed to create test bid alert");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <BeakerIcon className="mr-2 h-4 w-4" />
        Test Bid Alerts
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <BeakerIcon className="inline-block mr-2 h-4 w-4" />
          Test Bid Alerts
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          ×
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Source</label>
            <Select
              value={testBid.source}
              onValueChange={(value) =>
                setTestBid((prev) => ({ ...prev, source: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {TEST_SOURCES.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={testBid.title}
              onChange={(e) =>
                setTestBid((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="[TEST] Bid Title"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={testBid.description}
              onChange={(e) =>
                setTestBid((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Test bid description..."
            />
          </div>

          <div>
            <label className="text-sm font-medium">URL</label>
            <Input
              value={testBid.url}
              onChange={(e) =>
                setTestBid((prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder="https://example.com/test-bid"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <Select
              value={testBid.bidCategory}
              onValueChange={(value) =>
                setTestBid((prev) => ({
                  ...prev,
                  bidCategory: value,
                  services: [], // Reset services when category changes
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {TEST_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Services</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TEST_CATEGORIES.find(
                (c) => c.value === testBid.bidCategory
              )?.services.map((service) => (
                <Badge
                  key={service}
                  variant={
                    testBid.services.includes(service) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => handleServiceToggle(service)}
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Closing Date</label>
            <Input
              type="date"
              value={testBid.closingDate}
              onChange={(e) =>
                setTestBid((prev) => ({ ...prev, closingDate: e.target.value }))
              }
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSubmitTest}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Test Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
