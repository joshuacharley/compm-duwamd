"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import CommercialNav from "./CommercialNav";
import { useSession } from "next-auth/react";
import { ModeToggle } from "./ModeToggle";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            CommercialPM
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <CommercialNav />
            <ModeToggle />
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
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through the Commercial Project Management app
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <MobileNav />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

const MobileNav = () => {
  const { data: session } = useSession();
  const navItems = [
    { href: "/bids", label: "Bids" },
    { href: "/attendance", label: "Attendance" },
    { href: "/pre-sales", label: "Pre-Sales" },
    { href: "/reports", label: "Reports" },
    { href: "/projects", label: "Projects" },
    { href: "/tasks", label: "Tasks" },
    { href: "/trackers", label: "Trackers" },
    { href: "/weekly-report", label: "Weekly Report" },
    { href: "/birthday-wishes", label: "Birthday Wishes" },
    { href: "/directors-remarks", label: "Director's Remarks" },
    { href: "/action-plan", label: "Action Plan" },
    { href: "/action-points", label: "Action Points" },
    { href: "/sales-contributions", label: "Sales Contributions" },
    { href: "/activation-performance", label: "Activation Performance" },
    { href: "/horeca-kam-tracking", label: "HORECA & KAM Tracking" },
    { href: "/installation-setup", label: "Installation Setup" },
  ];

  return (
    <nav className="flex flex-col space-y-4">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className="text-sm font-medium">
          {item.label}
        </Link>
      ))}
      <ModeToggle />
      {session ? (
        <Button variant="ghost" asChild>
          <Link href="/api/auth/signout">Sign Out</Link>
        </Button>
      ) : (
        <Button variant="ghost" asChild>
          <Link href="/api/auth/signin">Sign In</Link>
        </Button>
      )}
    </nav>
  );
};
