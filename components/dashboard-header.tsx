"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

type DashboardHeaderProps = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  title?: string;
};

export function DashboardHeader({ mobileOpen, setMobileOpen, title }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-background">
      {/* Left section: Hamburger + Title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>

        {title && (
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h2>
        )}
      </div>

      {/* Right section: Status + Avatar */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Connected
          </span>
        </div>

        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-muted text-muted-foreground">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}