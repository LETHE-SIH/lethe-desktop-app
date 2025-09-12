"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { ClientsGrid } from "@/components/clients-grid";
import { ClientStats } from "@/components/client-stats";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Users } from "lucide-react";

export default function ClientsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} title="Client Management"/>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Users className="w-8 h-8" />
                Client Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor and manage connected client workstations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>

          <ClientStats />
          <ClientsGrid />
        </main>
      </div>
    </div>
  );
}