"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CommercialNav from './CommercialNav';
import { useSession } from 'next-auth/react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-primary text-primary-foreground p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          CommercialPM
        </Link>
        <CommercialNav />
        <div className="space-x-2">
          {session ? (
            <Button variant="ghost" asChild>
              <Link href="/api/auth/signout">Sign Out</Link>
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}