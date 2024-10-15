"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ActivationPerformancePage() {
  const [pendingActivations, setPendingActivations] = useState([]);
  const [salesChallengeKAM, setSalesChallengeKAM] = useState([]);
  const [salesChallengeCSE, setSalesChallengeCSE] = useState([]);
  const [fiberPerformance, setFiberPerformance] = useState({
    ytdAchievement: 0,
    ytdTarget: 0,
    weeklyData: [],
    activeBase: []
  });
  const [dedicatedInternetPerformance, setDedicatedInternetPerformance] = useState({
    weeklyData: [],
    contractUpdate: {}
  });

  useEffect(() => {
    // Fetch data from API
    // For now, we'll use mock data
    setPendingActivations([
      { id: 1, customerName: 'ORANGE MONEY SL LIMITED', service: 'POSTPAID', dateInitiated: '23-Aug-24', dateClose: '06-Oct-24', ageing: '60day', sla: 5, comment: 'On process @CX and Customer not yet paid the bill (Milton & customer)' },
      { id: 2, customerName: 'FACTS TECHNOLOGIES LTD', service: 'SDNL/L3VPN', dateInitiated: '09-Aug-24', dateClose: '30-Aug-24', ageing: '21day', sla: 4, comment: 'Close not on time' },
    ]);

    setSalesChallengeKAM([
      { name: 'Rebecca Aruna', postpaid: 0, cugLines: 10, dedicatedInternet: 0, fiber: 0, tollfree: 0, shortCode: 0, cloud: 0, ms365: 0, vpn: 0, apn: 0, airbox: 0, speedbox: 2 },
      { name: 'Ibrahim Conteh', postpaid: 0, cugLines: 0, dedicatedInternet: 0, fiber: 2, tollfree: 0, shortCode: 0, cloud: 0, ms365: 0, vpn: 2, apn: 0, airbox: 0, speedbox: 0 },
    ]);

    setSalesChallengeCSE([
      { name: 'Angella O. Thomas', postpaid: 0, cug: 0, fixedData: 0, airbox: 0, speedbox: 0, di: 0, fiber: 0 },
      { name: 'Habibatu J. Munda', postpaid: 0, cug: 0, fixedData: 0, airbox: 0, speedbox: 0, di: 0, fiber: 0 },
    ]);

    setFiberPerformance({
      ytdAchievement: 88,
      ytdTarget: 12,
      weeklyData: [
        { week: 'wk39', achievement: 5 },
        { week: 'wk40', achievement: 6 },
        { week: 'wk41', achievement: 4 },
      ],
      activeBase: [
        { month: 'Nov-27', count: 4 },
        { month: 'Jan-28', count: 10 },
        { month: 'Mar-28', count: 15 },
        { month: 'May-28', count: 24 },
        { month: 'Jul-28', count: 7 },
        { month: 'Sept-28', count: 10 },
      ]
    });

    setDedicatedInternetPerformance({
      weeklyData: [
        { week: 'wk34', achievement: 0 },
        { week: 'wk40', achievement: 0 },
        { week: 'wk41', achievement: 1 },
      ],
      contractUpdate: {
        postpaid: { base: 562, availableContract: 340, noContract: 222 },
        cug: { base: 409, availableContract: 350, noContract: 59 },
        fixData: { base: 203, availableContract: 150, noContract: 53 },
        fttx: { base: 256, availableContract: 256, noContract: 0 },
      }
    });
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Activation and Performance Tracking</h1>
        
        <Tabs defaultValue="pending-activations" className="mb-8">
          <TabsList>
            <TabsTrigger value="pending-activations">Pending Activations</TabsTrigger>
            <TabsTrigger value="sales-challenge">Sales Challenge</TabsTrigger>
            <TabsTrigger value="performance-updates">Performance Updates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending-activations">
            <Card>
              <CardHeader>
                <CardTitle>Pending Activations</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date Initiated</TableHead>
                      <TableHead>Date Close</TableHead>
                      <TableHead>Ageing</TableHead>
                      <TableHead>SLA</TableHead>
                      <TableHead>Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingActivations.map((activation) => (
                      <TableRow key={activation.id}>
                        <TableCell>{activation.customerName}</TableCell>
                        <TableCell>{activation.service}</TableCell>
                        <TableCell>{activation.dateInitiated}</TableCell>
                        <TableCell>{activation.dateClose}</TableCell>
                        <TableCell>{activation.ageing}</TableCell>
                        <TableCell>{activation.sla}</TableCell>
                        <TableCell>{activation.comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales-challenge">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>KAM's Sales Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Postpaid</TableHead>
                      <TableHead>CUG Lines</TableHead>
                      <TableHead>Dedicated Internet</TableHead>
                      <TableHead>FIBER</TableHead>
                      <TableHead>TOLLFREE</TableHead>
                      <TableHead>SHORT CODE</TableHead>
                      <TableHead>CLOUD</TableHead>
                      <TableHead>MS365</TableHead>
                      <TableHead>VPN</TableHead>
                      <TableHead>APN</TableHead>
                      <TableHead>AIRBOX</TableHead>
                      <TableHead>SPEEDBOX</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesChallengeKAM.map((kam, index) => (
                      <TableRow key={index}>
                        <TableCell>{kam.name}</TableCell>
                        <TableCell>{kam.postpaid}</TableCell>
                        <TableCell>{kam.cugLines}</TableCell>
                        <TableCell>{kam.dedicatedInternet}</TableCell>
                        <TableCell>{kam.fiber}</TableCell>
                        <TableCell>{kam.tollfree}</TableCell>
                        <TableCell>{kam.shortCode}</TableCell>
                        <TableCell>{kam.cloud}</TableCell>
                        <TableCell>{kam.ms365}</TableCell>
                        <TableCell>{kam.vpn}</TableCell>
                        <TableCell>{kam.apn}</TableCell>
                        <TableCell>{kam.airbox}</TableCell>
                        <TableCell>{kam.speedbox}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>CSE's Sales Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Postpaid</TableHead>
                      <TableHead>CUG</TableHead>
                      <TableHead>FIXED DATA</TableHead>
                      <TableHead>AIRBOX</TableHead>
                      <TableHead>SPEEDBOX</TableHead>
                      <TableHead>DI</TableHead>
                      <TableHead>FIBER</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesChallengeCSE.map((cse, index) => (
                      <TableRow key={index}>
                        <TableCell>{cse.name}</TableCell>
                        <TableCell>{cse.postpaid}</TableCell>
                        <TableCell>{cse.cug}</TableCell>
                        <TableCell>{cse.fixedData}</TableCell>
                        <TableCell>{cse.airbox}</TableCell>
                        <TableCell>{cse.speedbox}</TableCell>
                        <TableCell>{cse.di}</TableCell>
                        <TableCell>{cse.fiber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance-updates">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>FIBER UPDATE TARGET vs ACHIEVEMENT</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Achievement', value: fiberPerformance.ytdAchievement },
                            { name: 'Remaining', value: fiberPerformance.ytdTarget }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {[
                            { name: 'Achievement', value: fiberPerformance.ytdAchievement },
                            { name: 'Remaining', value: fiberPerformance.ytdTarget }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center mt-4">
                    (123 B2B Customer achieved from YTD for FIBER which is about 88%. We still have 12% (27 in count) more to hit H1 target of (150) customer.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>FIBER WOW UPDATE CHART</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={fiberPerformance.weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="achievement" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center mt-4">
                    30% percent decrease for wk41, compared to wk40 and wk39 weekly target not met 8per wk.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>DEDICATED INTERNET UPDATE TARGET vs ACHIEVEMENT</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dedicatedInternetPerformance.weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="achievement" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center mt-4">
                    90% percent Decrease for wk41 and wk40. weekly target not met 2per wk.
                  </p>
                  <p className="text-center">
                    YTD an achievement of 17 customer in count and 24 as per location
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contract Update</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Base</TableHead>
                        <TableHead>Available contract</TableHead>
                        <TableHead>No contract</TableHead>
                        <TableHead>% Avl. Contract vs Base</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(dedicatedInternetPerformance.contractUpdate).map(([service, data]) => (
                        <TableRow key={service}>
                          <TableCell>{service.toUpperCase()}</TableCell>
                          <TableCell>{data.base}</TableCell>
                          <TableCell>{data.availableContract}</TableCell>
                          <TableCell>{data.noContract}</TableCell>
                          <TableCell>{((data.availableContract / data.base) * 100).toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}