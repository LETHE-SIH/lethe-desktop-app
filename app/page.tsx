"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { WipeActivityChart } from "@/components/wipe-activity-chart"
import { ActiveWipe } from "@/components/active-wipe"
import { LogsSection } from "@/components/logs-section"

export default function Dashboard() {

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} title="Dashboard"/>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <StatsCards />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <WipeActivityChart />
            </div>
            <ActiveWipe />
          </div>

          <LogsSection />
        </main>
      </div>
    </div>
  )
}
