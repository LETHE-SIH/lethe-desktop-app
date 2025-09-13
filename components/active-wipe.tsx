"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HardDrive, CheckCircle } from "lucide-react";

// --------------------
// Types
// --------------------
type DashboardData = {
  total_drives: number;
  encrypted_drives: number;
  wipe_in_progress: number;
  wipe_active: boolean;
};

type EncryptStatus = {
  running: boolean;
  total_files: number;
  success: number;
  failed: number;
  progress: number;
  start_time: string;
  end_time: string;
  encrypted_dir: string;
  ciphers: string[];
  current_file: string;
  drive: string;
};

type DoDWipeStatus = {
  currentDisk: string;
  running: boolean;
  startedAt: string;
};

// --------------------
// ActiveWipe Component
// --------------------
export function ActiveWipe() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<EncryptStatus | null>(null);
  const [dodStatus, setDodStatus] = useState<DoDWipeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState<string>("");

  useEffect(() => {
    let dashboardInterval: NodeJS.Timer;
    let statusInterval: NodeJS.Timer;
    let dodInterval: NodeJS.Timer;
    let elapsedInterval: NodeJS.Timer;

    const fetchDashboard = () => {
      fetch("http://localhost:8080/api/v1/public/dashboard")
        .then((res) => res.json())
        .then((data) => {
          setDashboard({ ...data.physical_disks });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    const fetchStatus = () => {
      if (!dashboard?.wipe_active) {
        setStatus(null);
        return;
      }
      fetch("http://lethe-api.zerodev.me/api/v1/public/encrypt/status")
        .then((res) => res.json())
        .then((data) => setStatus(data))
        .catch(() => setStatus(null));
    };

    const fetchDoDWipe = () => {
      if (dashboard?.wipe_active) {
        setDodStatus(null);
        return;
      }
      fetch("http://lethe-api.zerodev.me/api/v1/public/wipe/status")
        .then((res) => res.json())
        .then((data) => {
          if (data.running) {
            setDodStatus(data);
            const started = new Date(data.startedAt);
            elapsedInterval = setInterval(() => {
              const diff = Date.now() - started.getTime();
              const hrs = Math.floor(diff / 3600000);
              const mins = Math.floor((diff % 3600000) / 60000);
              const secs = Math.floor((diff % 60000) / 1000);
              setElapsed(`${hrs}h ${mins}m ${secs}s`);
            }, 1000);
          } else {
            setDodStatus(null);
          }
        })
        .catch(() => setDodStatus(null));
    };

    // Initial fetch
    fetchDashboard();
    fetchStatus();
    fetchDoDWipe();

    // Set intervals
    dashboardInterval = setInterval(fetchDashboard, 2000); // 2s
    statusInterval = setInterval(fetchStatus, 1000); // 1s
    dodInterval = setInterval(fetchDoDWipe, 2000); // 2s

    return () => {
      clearInterval(dashboardInterval);
      clearInterval(statusInterval);
      clearInterval(dodInterval);
      clearInterval(elapsedInterval);
    };
  }, [dashboard?.wipe_active]);

  if (loading) {
    return (
      <Card className="bg-card border-border flex flex-col h-full">
        <CardHeader>
          <CardTitle>Active Wipe</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-center">
          Loading...
        </CardContent>
      </Card>
    );
  }

  // Case 1: Normal wipe in progress
  if (dashboard?.wipe_active && status) {
    const progressPercent = Math.min(
      Math.floor((status.success / status.total_files) * 100),
      100
    );

    return (
      <Card className="bg-card border-border flex flex-col h-full">
        <CardHeader>
          <CardTitle>Active Wipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Circular Progress */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg
                className="w-32 h-32 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 40 * (1 - progressPercent / 100)
                  }`}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-in-out"
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <HardDrive className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-green-400">
              {progressPercent}%
            </div>
            <div className="text-sm text-muted-foreground">
              Overwriting sectors...
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Drive:</span>
              <span className="text-card-foreground">{status.drive}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method:</span>
              <span className="text-card-foreground">
                {status.ciphers.join(", ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current File:</span>
              <span
                className="text-card-foreground truncate max-w-xs"
                title={status.current_file}
              >
                {status.current_file}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Files Encrypted:</span>
              <span className="text-card-foreground">
                {status.success} / {status.total_files}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Wipes In Progress:</span>
              <span className="text-card-foreground">
                {dashboard.wipe_in_progress}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Case 2: DoD wipe running
  if (dodStatus?.running) {
    const startedAtLocal = new Date(dodStatus.startedAt).toLocaleString();
    const circumference = 2 * Math.PI * 40;

    return (
      <Card className="bg-card border-border flex flex-col h-full">
        <CardHeader>
          <CardTitle>Active Wipe (DoD)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rotating Arc */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg
                className="w-32 h-32 animate-spin-slow"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference * 0.25} ${circumference}`}
                  strokeDashoffset="0"
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <HardDrive className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-green-400">Running...</div>
            <div className="text-sm text-muted-foreground">
              Secure erase in progress
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Disk:</span>
              <span className="text-card-foreground">
                {dodStatus.currentDisk}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started At:</span>
              <span className="text-card-foreground">{startedAtLocal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Elapsed:</span>
              <span className="text-card-foreground">{elapsed}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Case 3: No wipes at all
  return (
    <Card className="bg-card border-border flex flex-col h-full justify-center items-center text-center p-6">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-xl font-semibold text-card-foreground mb-2">
        No active wipes
      </h2>
      <p className="text-muted-foreground max-w-xs">
        There are currently no data wipes running. Your drives are safe. Check
        back later or start a new wipe task.
      </p>
    </Card>
  );
}
