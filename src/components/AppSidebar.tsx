
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

import {
  Activity,
  ArrowDownUp,
  Brain,
  FileText,
  Home,
  MessageSquare,
  Settings,
  SmartphoneCharging,
  ClipboardEdit,
  UserRound,
  Stethoscope
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const { state, setOpen } = useSidebar();
  const [openSheet, setOpenSheet] = React.useState(false);

  return (
    <>
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="p-0 flex flex-col" side="left">
          <SheetHeader className="px-6 mt-6">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Navigate through the app</SheetDescription>
          </SheetHeader>
          <nav className="flex-1 px-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => setOpenSheet(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-6">
            <Link to="/profile">
              <Button variant="outline" className="w-full justify-start gap-2">
                <UserRound className="h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link to="/settings" className="mt-2 block">
              <Button variant="secondary" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <aside
        className={cn(
          "hidden md:block h-full md:w-64 bg-background border-r",
          state === "collapsed" && "md:w-16"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          {state !== "collapsed" ? (
            <Link to="/" className="font-bold text-lg">
              Health Synergy
            </Link>
          ) : (
            <div className="w-full flex justify-center">
              <Link to="/">
                <Activity className="h-5 w-5 text-primary" />
              </Link>
            </div>
          )}
        </div>
        <nav className="flex-1 px-3 space-y-1 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                location.pathname === link.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {link.icon}
              {state !== "collapsed" && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
        {state !== "collapsed" && (
          <div className="p-6 border-t">
            <Link to="/profile">
              <Button variant="outline" className="w-full justify-start gap-2">
                <UserRound className="h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link to="/settings" className="mt-2 block">
              <Button variant="secondary" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

const links = [
  {
    href: "/",
    label: "Dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    href: "/ai-diagnostics",
    label: "AI Diagnostics",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    href: "/reports",
    label: "Health Reports",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    href: "/health-assistant",
    label: "Health Assistant",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    href: "/doctor-search",
    label: "Doctor Search",
    icon: <Stethoscope className="h-4 w-4" />,
  },
  {
    href: "/fitbit-integration",
    label: "Fitbit Integration",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    href: "/manual-data",
    label: "Manual Data Entry",
    icon: <ClipboardEdit className="h-4 w-4" />,
  },
];
