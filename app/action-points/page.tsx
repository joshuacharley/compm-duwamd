"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ActionPointsPage() {
  const [actionPoints, setActionPoints] = useState([]);

  useEffect(() => {
    // Fetch action points from API
    // For now, we'll use mock data
    setActionPoints([
      { id: 1, topic: 'SIERRA TROPICAL', description: 'Umar to have an engagement with the customer.', processingDate: '02-Sep-24', responsibility: 'Umaru', expectedClosingDate: '06-Sep-24', status: 'Pending' },
      { id: 2, topic: 'PIH', description: 'Nyake/Umar to engage customer for a test', processingDate: '30-Sep-24', responsibility: 'Umaru', expectedClosingDate: '7-Sep-24', status: 'Pending' },
      // ... add more mock data
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Action Points</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Processing Date</TableHead>
              <TableHead>Responsibility</TableHead>
              <TableHead>Expected Closing Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actionPoints.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.topic}</TableCell>
                <TableCell>{point.description}</TableCell>
                <TableCell>{point.processingDate}</TableCell>
                <TableCell>{point.responsibility}</TableCell>
                <TableCell>{point.expectedClosingDate}</TableCell>
                <TableCell>{point.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}