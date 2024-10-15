"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function WeeklyReportPage() {
  const [weeklyData, setWeeklyData] = useState(null);
  const [activityReport, setActivityReport] = useState(null);
  const [salesContributions, setSalesContributions] = useState(null);

  useEffect(() => {
    // Fetch weekly report data from API
    // For now, we'll use mock data
    setWeeklyData({
      weekNumber: 41,
      performanceMetrics: {
        sales: 1000000,
        newCustomers: 50,
        customerRetention: 95
      }
    });

    setActivityReport({
      informationSharing: [
        'Lovinda Junior Academy- offer shared for CUG & Postpaid',
        'Cinderalla Travel Tours- offer shared for Postpaid Service',
        'The B2B sales management in shops in progress for Freetown- Rawdon street, HQ-Shop, Waterloo and wellington Shops closed',
        'Agriculture Mining & Infrastructural- Appointment booked for different services',
        'Edhancha Mining & Agriculture company- Appointment booked for CUG, FTTX &Postpaid service'
      ],
      workedWell: [
        'Nancy Sheriff- Closed with FTTX - Le2,500',
        'Paul Koroma- Closed with Dedicated Internet 5mbps- Le8,510',
        'Lovinda Junior Academy- Closed with FTTX 150mbps+ 2 extenders- SLe8,950',
        'Techwire ICT Solutions- Closed with SMPP & APN service- SLe19,980',
        'Kaard Automobile SL- Closed with CUG 10lines- SLe2,800',
        'Sierra Leone Commercial Bank- Closed with Devices- SLe4,400',
        'HMB SL- Closed with FTTX 60mbps- SLe3,750'
      ],
      difficulties: [
        'No bank for payments in Waterloo and Wellington shops'
      ],
      alignmentRequest: [
        'Require a dedicated and temporary OM merchant account for Waterloo and Wellington shops pending when the banks are available in the shops'
      ]
    });

    setSalesContributions([
      { name: 'Ibrahim Bangura', team: 'LA1', amount: 19960.00 },
      { name: 'Umu Jeneba', team: 'LA2', amount: 0.00 },
      { name: 'Ibrahim Conteh', team: 'LA3', amount: 24880.00 },
      { name: 'Rebecca Aruna', team: 'LA4', amount: 7200.00 },
      { name: 'Alpha BAH', team: 'SME', amount: 2100.00 },
      { name: 'Esther Mansaray/Alhaji Kuyateh', team: 'SoHo', amount: 5890.00 }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">B2B Weekly Report - Network Update</h1>
        {weeklyData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Week {weeklyData.weekNumber} Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sales: ${weeklyData.performanceMetrics.sales.toLocaleString()}</p>
              <p>New Customers: {weeklyData.performanceMetrics.newCustomers}</p>
              <p>Customer Retention: {weeklyData.performanceMetrics.customerRetention}%</p>
            </CardContent>
          </Card>
        )}

        {activityReport && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Activity Report</h2>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Information Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {activityReport.informationSharing.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>What has worked well</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {activityReport.workedWell.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Difficulties / Challenges / Red flags / Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {activityReport.difficulties.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Alignment / Coordination / Support Request</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {activityReport.alignmentRequest.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {salesContributions && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Sales Contributions - Week {weeklyData?.weekNumber}</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Amount (SLE)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesContributions.map((contribution, index) => (
                  <TableRow key={index}>
                    <TableCell>{contribution.name}</TableCell>
                    <TableCell>{contribution.team}</TableCell>
                    <TableCell>{contribution.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="mt-4 font-bold">
              Total contribution: {salesContributions.reduce((sum, item) => sum + item.amount, 0).toFixed(2)} SLE
            </p>
          </div>
        )}
      </main>
    </div>
  );
}