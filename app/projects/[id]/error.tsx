"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-muted-foreground mb-4">
            There was an error loading the project details.
          </p>
          <Button onClick={reset}>Try again</Button>
        </div>
      </main>
    </div>
  );
}
