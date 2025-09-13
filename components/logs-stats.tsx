import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react"

type ApiResponse = {
  total_logs: number
  warnings: number
  errors: number
  success: number
  last_n: string[]
}

export function LogsStats() {
  const [stats, setStats] = useState<
    {
      title: string
      value: string
      icon: any
      color: string
      trend: string
    }[]
  >([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://lethe-api.zerodev.me/api/v1/public/logsfull")
        const data: ApiResponse = await res.json()

        const mappedStats = [
          {
            title: "Total Logs",
            value: data.total_logs.toLocaleString(),
            icon: Info,
            color: "text-blue-500",
            trend: `${data.last_n.length} recent entries`,
          },
          {
            title: "Warnings",
            value: data.warnings.toString(),
            icon: AlertTriangle,
            color: "text-orange-500",
            trend: data.warnings > 0 ? "Needs attention" : "No warnings",
          },
          {
            title: "Errors",
            value: data.errors.toString(),
            icon: XCircle,
            color: "text-red-500",
            trend: data.errors > 0 ? "Check logs" : "No errors",
          },
          {
            title: "Success",
            value: data.success.toLocaleString(),
            icon: CheckCircle,
            color: "text-green-500",
            trend: `${((data.success / (data.total_logs || 1)) * 100).toFixed(
              1
            )}% success rate`,
          },
        ]

        setStats(mappedStats)
      } catch (error) {
        console.error("Failed to fetch logs stats", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // auto-refresh every 5s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="bg-card border-border hover:bg-card/80 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-muted/50">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-card-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
