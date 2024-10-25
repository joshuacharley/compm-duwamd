"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Users, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Meeting {
  _id: string;
  title: string;
  date: Date;
  attendees: string[];
  notes: string;
}

interface ProjectCommunicationProps {
  projectId: string;
}

export default function ProjectCommunication({
  projectId,
}: ProjectCommunicationProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: new Date(),
    attendees: "",
    notes: "",
  });

  useEffect(() => {
    fetchMeetings();
  }, [projectId]);

  const fetchMeetings = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/meetings`);
      if (!response.ok) throw new Error("Failed to fetch meetings");
      const data = await response.json();
      setMeetings(data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to load meetings");
    }
  };

  const handleSubmitMeeting = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/projects/${projectId}/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMeeting,
          attendees: newMeeting.attendees.split(",").map((a) => a.trim()),
        }),
      });

      if (!response.ok) throw new Error("Failed to create meeting");

      await fetchMeetings();
      setIsDialogOpen(false);
      setNewMeeting({
        title: "",
        date: new Date(),
        attendees: "",
        notes: "",
      });
      toast.success("Meeting created successfully");
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create meeting");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Communication</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitMeeting} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newMeeting.title}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newMeeting.date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newMeeting.date}
                      onSelect={(date) =>
                        date && setNewMeeting({ ...newMeeting, date })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Attendees (comma-separated)
                </label>
                <Input
                  value={newMeeting.attendees}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, attendees: e.target.value })
                  }
                  placeholder="John Doe, Jane Smith"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Meeting Notes</label>
                <Textarea
                  value={newMeeting.notes}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, notes: e.target.value })
                  }
                  placeholder="Agenda and other notes..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Schedule Meeting</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="meetings">
          <TabsList className="mb-4">
            <TabsTrigger value="meetings">
              <Users className="mr-2 h-4 w-4" />
              Meetings
            </TabsTrigger>
            <TabsTrigger value="notes">
              <MessageSquare className="mr-2 h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meetings">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <Card key={meeting._id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{meeting.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(meeting.date), "PPP")}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium">Attendees:</h4>
                          <p className="text-sm text-muted-foreground">
                            {meeting.attendees.join(", ")}
                          </p>
                        </div>
                        {meeting.notes && (
                          <div>
                            <h4 className="text-sm font-medium">Notes:</h4>
                            <p className="text-sm text-muted-foreground">
                              {meeting.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="notes">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="mx-auto h-8 w-8 mb-2" />
              <p>Project notes and discussions will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
