"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function TrackersClient() {
  const [trackers, setTrackers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrackers() {
      try {
        const response = await fetch('/api/trackers');
        const data = await response.json();
        setTrackers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trackers:', error);
        setLoading(false);
      }
    }

    fetchTrackers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Trackers</h1>
        <div className="flex justify-between items-center mb-4">
          <Input className="w-64" placeholder="Search trackers..." />
          <Button>Add New Tracker</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trackers.map((tracker) => (
            <Card key={tracker._id}>
              <CardHeader>
                <CardTitle>{tracker.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={tracker.progress} className="mb-2" />
                <p>{tracker.progress}% Complete</p>
                <Button className="mt-2" variant="outline">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}