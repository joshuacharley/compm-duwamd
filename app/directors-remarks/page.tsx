"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function DirectorsRemarksPage() {
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    // Fetch director's remarks from API
    // For now, we'll use mock data
    setRemarks("This week's performance has been exceptional. Let's keep up the good work and focus on closing the deals in our pipeline.");
  }, []);

  const handleSaveRemarks = () => {
    // Save remarks to API
    console.log('Saving remarks:', remarks);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Director's Remarks</h1>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={5}
              className="mb-4"
            />
            <Button onClick={handleSaveRemarks}>Save Remarks</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}