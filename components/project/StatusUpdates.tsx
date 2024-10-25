"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Update {
  _id: string;
  content: string;
  author: string;
  date: Date;
}

interface StatusUpdatesProps {
  projectId: string;
}

export default function StatusUpdates({ projectId }: StatusUpdatesProps) {
  const { data: session } = useSession();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [newUpdate, setNewUpdate] = useState("");

  useEffect(() => {
    fetchUpdates();
  }, [projectId]);

  const fetchUpdates = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/updates`);
      if (!response.ok) throw new Error("Failed to fetch updates");
      const data = await response.json();
      setUpdates(data);
    } catch (error) {
      console.error("Error fetching updates:", error);
      toast.error("Failed to load status updates");
    }
  };

  const handleSubmitUpdate = async () => {
    if (!newUpdate.trim()) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newUpdate,
          author: session?.user?.name || "Anonymous",
        }),
      });

      if (!response.ok) throw new Error("Failed to post update");

      await fetchUpdates();
      setNewUpdate("");
      toast.success("Status update posted successfully");
    } catch (error) {
      console.error("Error posting update:", error);
      toast.error("Failed to post status update");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Share a project update..."
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
            />
            <Button onClick={handleSubmitUpdate}>Post Update</Button>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {updates.map((update) => (
                <div
                  key={update._id}
                  className="flex gap-4 p-4 bg-muted rounded-lg"
                >
                  <Avatar>
                    <AvatarFallback>{update.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{update.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(update.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{update.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
