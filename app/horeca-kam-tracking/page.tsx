"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function HorecaKamTrackingPage() {
  const [horecaAchievements, setHorecaAchievements] = useState([]);
  const [kamBase, setKamBase] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    // Fetch data from API
    // For now, we'll use mock data
    setHorecaAchievements([
      { id: 1, customerName: 'Club Lamarie (Multiple A & M Resorts', acquisition: 'FTTH', date: 'July' },
      { id: 2, customerName: 'VICTORUS HOLIDAY HOMES', acquisition: 'CUG & POSTPAID', date: 'July' },
      { id: 3, customerName: 'Zunor Limited Guest House', acquisition: 'FTTH', date: 'September' },
    ]);

    setKamBase([
      { name: 'LA1 Ibrahim Sorie Bangura', cusWithService: 129, cusWithoutService: 0, averagePercentage: 64.10, sector: 'Mining, Industries, Energy' },
      { name: 'LA2 Umu Jeneba Fofanah', cusWithService: 172, cusWithoutService: 40, averagePercentage: 105, sector: 'NGO, Government, Diplomatic corps' },
      { name: 'LA3 Ibrahim Conteh', cusWithService: 25, cusWithoutService: 36, averagePercentage: 30.50, sector: 'Financial Institutions' },
      { name: 'LA4 Rebecca Aruna', cusWithService: 16, cusWithoutService: 134, averagePercentage: 75, sector: 'Utility, Hospitality, HORECA' },
      { name: 'SME Alpha Umaru Bah', cusWithService: 346, cusWithoutService: 1449, averagePercentage: 0, sector: '' },
      { name: 'SOHO Alhaji & Esther', cusWithService: 86, cusWithoutService: 0, averagePercentage: 0, sector: '' },
    ]);

    setChallenges([
      { issue: 'No equipment available for FIBER installation', recommendation: '(OSL MANAGEMENT, CX, NETWORK & METRO ) need to have full visibility of the procure FIBER equipment for installation to avoid future shortages on equipmentwhich impacted on the sales drive to bring in more customer ...' },
      { issue: 'Delayed on Service Activation', recommendation: '(CX, NETWORK & ITN) Meeting to be held with their respective head of department and people involve in our daily service activation on above SLA ...' },
      { issue: 'Delayed on Director\'s signature in the document for processing', recommendation: '(Annie / Priscilla) To support on this . Or the said Director\'s assigned someone to be signing this document to avoid delayed on delivery service to the customers..' },
      { issue: 'Uncompleted documentation for processing on activation', recommendation: 'Any document submitted without full details cannot be process unless an exceptional approval mail is initiated by the requestor with an approval.' },
      { issue: 'Challenge on Printer ink (HP 59A)', recommendation: 'A large quantity be purchase at procurement dept to avoid delaying customer request as this impact our daily processing of new request.' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">HORECA and KAM Tracking</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>HORECA Achievement H2</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>HORECA Acquisition</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {horecaAchievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell>{achievement.customerName}</TableCell>
                    <TableCell>{achievement.acquisition}</TableCell>
                    <TableCell>{achievement.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>KAM's Base</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kamBase}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cusWithService" name="Customers with Service" fill="#8884d8" />
                  <Bar dataKey="cusWithoutService" name="Customers without Service" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>KAM</TableHead>
                  <TableHead>Customers with Service</TableHead>
                  <TableHead>Customers without Service</TableHead>
                  <TableHead>Average Percentage</TableHead>
                  <TableHead>Sector</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kamBase.map((kam, index) => (
                  <TableRow key={index}>
                    <TableCell>{kam.name}</TableCell>
                    <TableCell>{kam.cusWithService}</TableCell>
                    <TableCell>{kam.cusWithoutService}</TableCell>
                    <TableCell>{kam.averagePercentage}%</TableCell>
                    <TableCell>{kam.sector}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Challenges and Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Challenge</TableHead>
                  <TableHead>Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {challenges.map((challenge, index) => (
                  <TableRow key={index}>
                    <TableCell>{challenge.issue}</TableCell>
                    <TableCell>{challenge.recommendation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}