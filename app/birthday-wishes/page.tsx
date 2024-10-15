"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function BirthdayWishesPage() {
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    // Fetch birthdays from API
    // For now, we'll use mock data
    setBirthdays([
      { id: 1, name: 'John Doe', date: '2024-09-10' },
      { id: 2, name: 'Jane Smith', date: '2024-09-15' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Birthday Wishes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {birthdays.map((birthday) => (
            <Card key={birthday.id}>
              <CardHeader>
                <CardTitle>{birthday.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Birthday: {new Date(birthday.date).toLocaleDateString()}</p>
                <p className="mt-2">🎉 Happy Birthday! 🎂</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}