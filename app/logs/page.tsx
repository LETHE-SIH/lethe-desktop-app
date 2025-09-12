"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { LogsTable } from "@/components/logs-table";
import { LogsFilters } from "@/components/logs-filters";
import { LogsStats } from "@/components/logs-stats";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, FileText } from "lucide-react";

export default function LogsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} title="System Logs"/>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <FileText className="w-8 h-8" />
                System Logs
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor system activities and troubleshoot issues
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </div>

          <LogsStats />
          <LogsFilters />
          <LogsTable />
        </main>
      </div>
    </div>
  );
}