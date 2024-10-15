"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function BidsPage() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    // Fetch bids data from API
    // For now, we'll use mock data
    setBids([
      {
        id: 1,
        name: 'Country coordinating Mechanism (CCM SL)',
        service: 'Provisioning of 4Mbps DI service',
        deadline: '17th October 2024',
        biddingType: 'Physical delivery or via email',
        keyRequirements: [
          'Survey of the location and provisioning of BOQ',
          'Getting all the requirement setup in the bid',
          'Putting together the bid',
          'Finalizing the commercials',
          'Get all documents signed and stamped',
          'Share bid proposal before the deadline(16th of October 2024)'
        ]
      },
      {
        id: 2,
        name: 'Ministry of Finance',
        service: 'Provisioning of 150 Mbps DI service',
        deadline: '22nd October 2024',
        biddingType: 'Physical delivery and opening of bid',
        keyRequirements: [
          'Survey of the location and provisioning of BOQ',
          'Getting all the requirement setup in the bid',
          'Putting together the bid',
          'Printing and decently presenting of all document',
          'Bid security',
          'Finalizing the commercials'
        ]
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Bids</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bids.map((bid) => (
            <Card key={bid.id}>
              <CardHeader>
                <CardTitle>{bid.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Service:</strong> {bid.service}</p>
                <p><strong>Deadline:</strong> {bid.deadline}</p>
                <p><strong>Bidding Type:</strong> {bid.biddingType}</p>
                <h3 className="font-bold mt-2">Key Requirements:</h3>
                <ul className="list-disc pl-5">
                  {bid.keyRequirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}