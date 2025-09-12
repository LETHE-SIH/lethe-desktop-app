"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { DrivesTable } from "@/components/drives-table";
import { DriveFilters } from "@/components/drive-filters";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export default function DrivesPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} title="Drives Management"/>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Drives Management</h1>
              <p className="text-muted-foreground mt-1">
                Monitor and manage all connected drives
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Drive
              </Button>
            </div>
          </div>

          <DriveFilters />
          <DrivesTable />
        </main>
      </div>
    </div>
  );
}