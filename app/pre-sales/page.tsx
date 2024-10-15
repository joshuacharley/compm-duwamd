"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PreSalesPage() {
  const [pipelineProjects, setPipelineProjects] = useState([]);
  const [activityReport, setActivityReport] = useState({});

  useEffect(() => {
    // Fetch pipeline projects and activity report from API
    // For now, we'll use mock data
    setPipelineProjects([
      { id: 1, customerName: 'Bank of Innovation and Partnership', service: 'Cloud solution', monthlyContract: 11950, dealWorth: 143400, status: 'Ongoing' },
      { id: 2, customerName: 'Moa West Africa International Entertainment service Ltd', service: 'DI', monthlyContract: 110000, dealWorth: 1323500, status: 'Open' },
      // ... add more mock data
    ]);

    setActivityReport({
      informationSharing: [
        'RFQ for the provisioning of DI for Country Coordinating Mechanism SL office and ministry of finance. Team is currently working on the bidding proposal',
        'SMPP integration for WAVE SL currently ongoing',
        'Notice a decrease in the Postpaid roaming data. Working with CX to investigate the reason for the decrease'
      ],
      workedWell: [
        'AMJAM and associates SMPP cost approval granted by management. Customer have signed the contract and payment made. Team is expected to close by next week',
        'Contract closure for Freetown waste transformation USSD service, payment made and we await customer approval letter from NatCA'
      ],
      difficulties: [
        'Closure of USSD clean-up. To be completed next week'
      ]
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">B2B Weekly Report - Pre-sales</h1>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Pipeline Projects</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Monthly Contract (SLE)</TableHead>
              <TableHead>Deal Worth (SLE)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pipelineProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.customerName}</TableCell>
                <TableCell>{project.service}</TableCell>
                <TableCell>{project.monthlyContract.toLocaleString()}</TableCell>
                <TableCell>{project.dealWorth.toLocaleString()}</TableCell>
                <TableCell>{project.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <h2 className="text-2xl font-bold mt-8 mb-4">Activity Report</h2>
        <Card>
          <CardHeader>
            <CardTitle>Information Sharing</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {activityReport.informationSharing?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>What has worked well</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {activityReport.workedWell?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Difficulties / Challenges / Red flags / Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {activityReport.difficulties?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}