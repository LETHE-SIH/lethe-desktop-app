"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { ProfileSettings } from "@/components/profile-settings";
import { DeviceInfo } from "@/components/device-info";
import { User } from "lucide-react";

export default function ProfilePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} title="My Device / Profile" />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <User className="w-8 h-8" />
              My Device / Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your device settings and user profile
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProfileSettings />
            <DeviceInfo />
          </div>
        </main>
      </div>
    </div>
  );
}