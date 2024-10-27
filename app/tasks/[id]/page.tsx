"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Task {
  _id: string;
  name: string;
  description?: string;
  status: "Not Started" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
}

interface Comment {
  _id: string;
  content: string;
  userId: string;
  userName: string;
  taskId: string;
  createdAt: string;
}

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SessionData {
  user?: User;
  expires: string;
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession() as { data: SessionData | null };
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTaskAndComments() {
      try {
        const taskResponse = await fetch(`/api/tasks/${params.id}`);
        if (!taskResponse.ok) {
          throw new Error("Failed to fetch task");
        }
        const taskData = await taskResponse.json();
        setTask(taskData);

        const commentsResponse = await fetch(
          `/api/tasks/${params.id}/comments`
        );
        if (!commentsResponse.ok) {
          throw new Error("Failed to fetch comments");
        }
        const commentsData = await commentsResponse.json();
        setComments(commentsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching task and comments:", error);
        toast.error("Failed to load task details");
        setLoading(false);
      }
    }

    fetchTaskAndComments();
  }, [params.id]);

  const handleAddComment = async () => {
    if (!session?.user) {
      toast.error("You must be logged in to add comments");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${params.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          userId: session.user.id,
          userName: session.user.name || "Anonymous",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newCommentData = await response.json();
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto mt-8">
          <div className="flex items-center justify-center">
            <p className="text-lg">Loading task details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto mt-8">
          <div className="flex items-center justify-center">
            <p className="text-lg text-red-500">Task not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">{task.name}</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong className="font-semibold">Status:</strong>{" "}
                <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {task.status}
                </span>
              </p>
              <p>
                <strong className="font-semibold">Priority:</strong>{" "}
                <span className="px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  {task.priority}
                </span>
              </p>
              {task.description && (
                <p>
                  <strong className="font-semibold">Description:</strong>{" "}
                  <span className="text-gray-700">{task.description}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="space-y-4 mb-8">
          {comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <Card key={comment._id}>
                <CardContent className="pt-4">
                  <p className="text-gray-800">{comment.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    By {comment.userName} on{" "}
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleAddComment}
            disabled={!session?.user || !newComment.trim()}
          >
            Add Comment
          </Button>
          {!session?.user && (
            <p className="text-sm text-red-500">
              Please sign in to add comments
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
