import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
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

const CommercialNav = () => {
  const pathname = usePathname();

  const mainMenuItems = [
    { href: "/bids", label: "Bids", icon: FileText },
    { href: "/attendance", label: "Attendance", icon: Users },
    { href: "/pre-sales", label: "Pre-Sales", icon: Briefcase },
    { href: "/reports", label: "Reports", icon: PieChart },
    { href: "/projects", label: "Projects", icon: Clipboard },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
  ];

  const moreMenuItems = [
    { href: "/trackers", label: "Trackers", icon: Target },
    { href: "/weekly-report", label: "Weekly Report", icon: BarChart },
    { href: "/birthday-wishes", label: "Birthday Wishes", icon: Gift },
    {
      href: "/directors-remarks",
      label: "Director's Remarks",
      icon: MessageSquare,
    },
    { href: "/action-plan", label: "Action Plan", icon: Clipboard },
    { href: "/action-points", label: "Action Points", icon: Zap },
    {
      href: "/sales-contributions",
      label: "Sales Contributions",
      icon: TrendingUp,
    },
    {
      href: "/activation-performance",
      label: "Activation Performance",
      icon: Activity,
    },
    {
      href: "/horeca-kam-tracking",
      label: "HORECA & KAM Tracking",
      icon: Target,
    },
    { href: "/installation-setup", label: "Installation Setup", icon: Zap },
  ];

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {mainMenuItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-foreground hover:text-brand-orange transition-colors",
                  pathname === item.href && "text-brand-orange"
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-foreground hover:text-brand-orange transition-colors">
            More
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {moreMenuItems.map((item) => (
                <ListItem
                  key={item.href}
                  title={item.label}
                  href={item.href}
                  icon={item.icon}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-brand-orange hover:text-white focus:bg-brand-orange focus:text-white",
            className
          )}
          {...props}
        >
          <div className="flex items-center">
            <Icon className="w-4 h-4 mr-2" />
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default CommercialNav;
