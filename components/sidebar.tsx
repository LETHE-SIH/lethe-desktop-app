"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  HardDrive,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Drives", href: "/drives", icon: HardDrive },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "My Device / Profile", href: "/profile", icon: User },
];

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect mobile on resize
  useEffect(() => {
    const checkMobile = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      if (isNowMobile) setCollapsed(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile && typeof setMobileOpen === "function") {
      setMobileOpen(false);
    }
  }, [pathname, isMobile, setMobileOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 relative",
          isMobile
            ? cn(
                "fixed left-0 top-0 z-50 w-64 transform transition-transform",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
              )
            : collapsed
            ? "w-16"
            : "w-64"
        )}
      >
        {/* Collapse button (desktop only) */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed((prev) => !prev)}
            className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border hover:bg-sidebar-accent"
          >
            {collapsed ? (
              <ChevronRight className="w-3 h-3 text-sidebar-foreground" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-sidebar-foreground" />
            )}
          </Button>
        )}

        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
          <img
            src="/GoRecycle Logo blue3.png"
            alt="Lethe Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          {(isMobile || !collapsed) && (
            <h1 className="text-xl font-bold text-sidebar-foreground">
              LETHE
            </h1>
          )}
        </div>

        {/* Connection status */}
        <div className="px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {(isMobile || !collapsed) && (
              <span className="text-sm text-sidebar-foreground">Connected</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={name} href={href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    !isMobile && collapsed && "px-3 justify-center"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {(isMobile || !collapsed) && (
                    <span className="font-medium">{name}</span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {(isMobile || !collapsed) && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-muted-foreground text-center">
              LETHE v2.1.0
            </div>
          </div>
        )}
      </div>
    </>
  );
}