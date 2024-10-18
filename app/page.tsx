import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  FileText,
  Users,
  PieChart,
  Briefcase,
  Calendar,
  CheckSquare,
  Target,
  BarChart,
  Gift,
  MessageSquare,
  Clipboard,
  Zap,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function Home() {
  const tabs = [
    {
      name: "Bids",
      href: "/bids",
      description: "View and manage all bids",
      icon: FileText,
    },
    {
      name: "Attendance",
      href: "/attendance",
      description: "Track attendance records",
      icon: Users,
    },
    {
      name: "Pre-Sales",
      href: "/pre-sales",
      description: "Manage pre-sales activities",
      icon: Briefcase,
    },
    {
      name: "Reports",
      href: "/reports",
      description: "Access reports and analytics",
      icon: PieChart,
    },
    {
      name: "Projects",
      href: "/projects",
      description: "Manage ongoing projects",
      icon: Clipboard,
    },
    {
      name: "Tasks",
      href: "/tasks",
      description: "Track and assign tasks",
      icon: CheckSquare,
    },
    {
      name: "Trackers",
      href: "/trackers",
      description: "Monitor project progress",
      icon: Target,
    },
    {
      name: "Weekly Report",
      href: "/weekly-report",
      description: "View weekly performance updates",
      icon: BarChart,
    },
    {
      name: "Birthday Wishes",
      href: "/birthday-wishes",
      description: "Celebrate team birthdays",
      icon: Gift,
    },
    {
      name: "Director's Remarks",
      href: "/directors-remarks",
      description: "Read important notes from the director",
      icon: MessageSquare,
    },
    {
      name: "Action Plan",
      href: "/action-plan",
      description: "Review and update action plans",
      icon: Clipboard,
    },
    {
      name: "Action Points",
      href: "/action-points",
      description: "Track key action items",
      icon: Zap,
    },
    {
      name: "Sales Contributions",
      href: "/sales-contributions",
      description: "Monitor sales team performance",
      icon: TrendingUp,
    },
    {
      name: "Activation Performance",
      href: "/activation-performance",
      description: "Track service activation metrics",
      icon: Activity,
    },
    {
      name: "HORECA & KAM Tracking",
      href: "/horeca-kam-tracking",
      description: "Monitor HORECA and Key Account Management",
      icon: Target,
    },
    {
      name: "Installation Setup",
      href: "/installation-setup",
      description: "Manage service installations",
      icon: Zap,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto mt-8 px-4 pb-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gradient">
          Commercial Department Project Management
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tabs.map((tab) => (
            <Link key={tab.name} href={tab.href} className="block">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 border-brand-orange hover:bg-brand-orange hover:text-white group">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg group-hover:text-white">
                    {tab.icon && <tab.icon className="w-6 h-6 mr-2" />}
                    {tab.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm group-hover:text-white">
                    {tab.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
