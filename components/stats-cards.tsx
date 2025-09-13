import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HardDrive, Shield, RotateCcw, CheckCircle } from "lucide-react";

export function StatsCards() {
  const [dashboard, setDashboard] = useState({
    total_drives: 0,
    encrypted_drives: 0,
    wipe_in_progress: 0,
    wipe_active: false,
  });

  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://lethe-api.zerodev.me/api/v1/public/dashboard");
      const data = await res.json();
      if (data?.physical_disks) {
        let updatedDashboard = { ...data.physical_disks };

        // ✅ if wipe_in_progress is 0, check /wipe/status
        if (updatedDashboard.wipe_in_progress === 0) {
          try {
            const wipeRes = await fetch("http://lethe-api.zerodev.me/api/v1/public/wipe/status");
            const wipeData = await wipeRes.json();
            if (wipeData?.running) {
              updatedDashboard.wipe_in_progress = 1; // set to 1 to indicate a running wipe
              updatedDashboard.wipe_active = true; // optional: mark active
            }
          } catch (err) {
            console.error("Failed to fetch wipe status:", err);
          }
        }

        setDashboard(updatedDashboard);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    // ✅ initial fetch
    fetchDashboard();

    // ✅ poll every 5 seconds
    const interval = setInterval(fetchDashboard, 5000);

    // cleanup
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "Drives detected",
      value: dashboard.total_drives.toString(),
      icon: HardDrive,
      color: "text-muted-foreground",
      trend: `+${dashboard.total_drives - 2} from last week`,
    },
    {
      title: "Drives encrypted",
      value: dashboard.encrypted_drives.toString(),
      icon: Shield,
      color: "text-blue-400",
      trend: `${
        dashboard.total_drives > 0
          ? Math.round(
              (dashboard.encrypted_drives / dashboard.total_drives) * 100
            )
          : 0
      }% of total drives`,
    },
    {
      title: "Wipes in progress",
      value: dashboard.wipe_in_progress.toString(),
      icon: RotateCcw,
      color: "text-orange-500",
      trend:
        dashboard.wipe_in_progress > 0
          ? "Est. 3h remaining"
          : "No active wipes",
    },
    {
      title: "Last completed wipe",
      value: dashboard.wipe_active ? "In Progress" : "Done",
      icon: CheckCircle,
      color: dashboard.wipe_active ? "text-yellow-500" : "text-green-500",
      trend: dashboard.wipe_active ? "Running now" : "2 hours ago",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="bg-card border-border hover:bg-card/80 transition-colors cursor-pointer"
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4">
                <div className="p-2 rounded-lg bg-muted/50 w-fit mb-2 sm:mb-0">
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
                <div className="text-xs text-muted-foreground text-left sm:text-right hidden xs:block">
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-card-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {stat.title}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
