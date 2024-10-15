"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function InstallationSetupPage() {
  const [installations, setInstallations] = useState([]);

  useEffect(() => {
    // Fetch installation and setup data from API
    // For now, we'll use mock data
    setInstallations([
      { id: 1, customerName: 'Empire Solution', service: 'Cloud service', startDate: '19-Jul-24', dependency: 'Empire Solution', remarks: 'VPN configured and customer had to complete the integration from their end. Awaiting their feedback', aging: 117, status: 'Ongoing' },
      { id: 2, customerName: 'Wave', service: 'SMPP', startDate: '08-Oct-24', dependency: 'Wave/CX/IT', remarks: 'Configuration ongoing and both teams are making progress', aging: 6, status: 'Open' },
      // ... add more mock data
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Installation and Setup List</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Dependency</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Aging (days)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {installations.map((install) => (
              <TableRow key={install.id}>
                <TableCell>{install.customerName}</TableCell>
                <TableCell>{install.service}</TableCell>
                <TableCell>{install.startDate}</TableCell>
                <TableCell>{install.dependency}</TableCell>
                <TableCell>{install.remarks}</TableCell>
                <TableCell>{install.aging}</TableCell>
                <TableCell>
                  <Badge variant={install.status === 'Ongoing' ? 'default' : 'secondary'}>
                    {install.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}