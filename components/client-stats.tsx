import { Card, CardContent } from "@/components/ui/card"
import { Monitor, Wifi, AlertTriangle, CheckCircle } from "lucide-react"

const stats = [
  {
    title: "Total Clients",
    value: "24",
    icon: Monitor,
    color: "text-blue-500",
    trend: "+3 this week",
  },
  {
    title: "Online",
    value: "18",
    icon: Wifi,
    color: "text-green-500",
    trend: "75% uptime",
  },
  {
    title: "Active Operations",
    value: "5",
    icon: CheckCircle,
    color: "text-orange-500",
    trend: "2 wipes in progress",
  },
  {
    title: "Issues",
    value: "2",
    icon: AlertTriangle,
    color: "text-red-500",
    trend: "Connection timeout",
  },
]

export function ClientStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="bg-card border-border hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-muted/50">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-xs text-muted-foreground text-right">{stat.trend}</div>
              </div>
              <div>
                <p className="text-3xl font-bold text-card-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
