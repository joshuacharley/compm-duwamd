"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function ActionPlanPage() {
  const [actionPlan, setActionPlan] = useState([]);

  useEffect(() => {
    // Fetch action plan data from API
    // For now, we'll use mock data
    setActionPlan([
      {
        id: 1,
        service: 'Postpaid',
        description: 'Postpaid Roaming data analysis',
        actions: 'Deep dive on the revenue for postpaid',
        owner: 'Nyake',
        dependency: 'Mohamud Kamara',
        department: 'CX',
        deadline: '31-May-24',
        actualCompletionDate: '20-May-24',
        status: 'Closed',
        comments: 'Deep dive completed and reasons for the deep in revenue shared'
      },
      {
        id: 2,
        service: 'Postpaid',
        description: 'Share location for which OSL is roaming',
        actions: 'Share list of locations that OSL is roaming',
        owner: 'Nyake',
        dependency: 'Papa',
        department: 'Wholesale',
        deadline: '20-Jun-24',
        actualCompletionDate: '20-Jun-24',
        status: 'Closed',
        comments: 'List of locations shared 132 locations in total'
      },
      // Add more mock data here
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Action Plan</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Dependency</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Actual Completion</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actionPlan.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.service}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.actions}</TableCell>
                <TableCell>{item.owner}</TableCell>
                <TableCell>{item.dependency}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.deadline}</TableCell>
                <TableCell>{item.actualCompletionDate}</TableCell>
                <TableCell>
                  <Badge variant={item.status === 'Closed' ? 'secondary' : 'default'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}