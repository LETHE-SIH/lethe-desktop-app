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

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/public/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data?.physical_disks) {
          setDashboard(data.physical_disks);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
      });
  }, []);

  const stats = [
    {
      title: "Drives detected",
      value: dashboard.total_drives.toString(),
      icon: HardDrive,
      color: "text-muted-foreground",
      trend: `+${dashboard.total_drives - 2} from last week`, // Example trend
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
