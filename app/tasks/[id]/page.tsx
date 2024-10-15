"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTaskAndComments() {
      try {
        const taskResponse = await fetch(`/api/tasks/${params.id}`);
        const taskData = await taskResponse.json();
        setTask(taskData);

        const commentsResponse = await fetch(`/api/tasks/${params.id}/comments`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching task and comments:', error);
        setLoading(false);
      }
    }

    fetchTaskAndComments();
  }, [params.id]);

  const handleAddComment = async () => {
    try {
      const response = await fetch(`/api/tasks/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId: session?.user?.id,
          userName: session?.user?.name,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([...comments, newCommentData]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">{task.name}</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Description:</strong> {task.description}</p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <Card key={comment._id}>
              <CardContent className="pt-4">
                <p>{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  By {comment.userName} on {new Date(comment.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleAddComment}>Add Comment</Button>
        </div>
      </main>
    </div>
  );
}