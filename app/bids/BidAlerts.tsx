"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface BidAlert {
  _id: string;
  source: string;
  title: string;
  description?: string;
  url: string;
  bidCategory: string;
  services: string[];
  publishDate: string;
  closingDate?: string;
  notified: boolean;
}

export default function BidAlerts() {
  const [alerts, setAlerts] = useState<BidAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/bid-alerts");
      if (!response.ok) throw new Error("Failed to fetch alerts");
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching bid alerts:", error);
      toast.error("Failed to load bid alerts");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch("/api/bid-alerts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notified: true }),
      });

      if (!response.ok) throw new Error("Failed to update alert");

      setAlerts(
        alerts.map((alert) =>
          alert._id === id ? { ...alert, notified: true } : alert
        )
      );
    } catch (error) {
      console.error("Error updating alert:", error);
      toast.error("Failed to update alert status");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Communication":
        return "bg-blue-100 text-blue-800";
      case "Connectivity":
        return "bg-green-100 text-green-800";
      case "Collaboration":
        return "bg-purple-100 text-purple-800";
      case "ICT":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Bid Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Bid Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No bid alerts found. New alerts will appear here when relevant
              bids are detected.
            </p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert._id}
                className={`p-4 rounded-lg border ${
                  !alert.notified
                    ? "bg-blue-50 border-blue-200"
                    : "bg-background"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Source: {alert.source}
                    </p>
                  </div>
                  <Badge className={getCategoryColor(alert.bidCategory)}>
                    {alert.bidCategory}
                  </Badge>
                </div>

                {alert.description && (
                  <p className="text-sm mb-2">{alert.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-2">
                  {alert.services.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="space-y-1">
                    <p>
                      Published:{" "}
                      {new Date(alert.publishDate).toLocaleDateString()}
                    </p>
                    {alert.closingDate && (
                      <p>
                        Closes:{" "}
                        {new Date(alert.closingDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!alert.notified && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => markAsRead(alert._id)}
                      >
                        Mark as Read
                      </Badge>
                    )}
                    <a
                      href={alert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      View Bid <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
