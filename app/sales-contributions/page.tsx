"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function SalesContributionsPage() {
  const [salesData, setSalesData] = useState([]);
  const [weeklySalesTrend, setWeeklySalesTrend] = useState([]);

  useEffect(() => {
    // Fetch sales data from API
    // For now, we'll use mock data
    setSalesData([
      {
        name: 'LA1 -Ibrahim S Bangura',
        'B2B mobile data revenue and growth': { target: 26266.667, actual: 0 },
        'B2B Customer Roaming': { target: 12500, actual: 0 },
        'B2B FTTH Active customer': { target: 17500, actual: 8510 },
      },
      {
        name: 'LA2 - Umu Jeneba',
        'B2B mobile data revenue and growth': { target: 32833.333, actual: 0 },
        'B2B Customer Roaming': { target: 19625, actual: 0 },
        'B2B FTTH Active customer': { target: 21875, actual: 0 },
      },
      {
        name: 'LA3 -Ibrahim Conteh',
        'B2B mobile data revenue and growth': { target: 26266.667, actual: 0 },
        'B2B Customer Roaming': { target: 3375, actual: 0 },
        'B2B FTTH Active customer': { target: 13125, actual: 20000 },
      },
      {
        name: 'LA4 - Rebacca Harunah',
        'B2B mobile data revenue and growth': { target: 19700, actual: 3750 },
        'B2B Customer Roaming': { target: 8750, actual: 0 },
        'B2B FTTH Active customer': { target: 0, actual: 0 },
      },
      {
        name: 'SME - Alpha Bah',
        'B2B mobile data revenue and growth': { target: 19700, actual: 3750 },
        'B2B Customer Roaming': { target: 2500, actual: 0 },
        'B2B FTTH Active customer': { target: 2375, actual: 0 },
      },
      {
        name: 'SOHO- Esther/ Alhaji Kuyateh',
        'B2B mobile data revenue and growth': { target: 10506.6667, actual: 0 },
        'Dedicated Internet and VPN Revenue + Cloud': { target: 9895.8333, actual: 420 },
      },
    ]);

    setWeeklySalesTrend([
      { week: 'Week 32', sales: 213745 },
      { week: 'Week 33', sales: 96106 },
      { week: 'Week 34', sales: 113898 },
      { week: 'Week 35', sales: 157653 },
      { week: 'Week 36', sales: 80930 },
      { week: 'Week 37', sales: 84490 },
      { week: 'Week 38', sales: 109122 },
      { week: 'Week 39', sales: 51234 },
      { week: 'Week 40', sales: 94790 },
      { week: 'Week 41', sales: 60030 },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Sales Contributions - Week 41</h1>
        
        {salesData.map((data, index) => (
          <Card key={index} className="mb-8">
            <CardHeader>
              <CardTitle>{data.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[data]} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  {Object.keys(data).filter(key => key !== 'name').map((key, i) => (
                    <Bar key={i} dataKey={`${key}.target`} name={`${key} Target`} fill="#8884d8" />
                  ))}
                  {Object.keys(data).filter(key => key !== 'name').map((key, i) => (
                    <Bar key={i} dataKey={`${key}.actual`} name={`${key} Actual`} fill="#82ca9d" />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Weekly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklySalesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              <li>The sales team recorded a decrease in revenue for week 41 compared to week 40. The decrease was as a result of deals in the pipeline not yet closed and only new sales were recorded.</li>
              <li>MTD,35% achieved against target.</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}