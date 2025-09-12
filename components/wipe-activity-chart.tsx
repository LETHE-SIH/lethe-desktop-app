"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts"
import { TrendingUp, Activity } from "lucide-react"

const data = [
  { month: "Oct", wipes: 1, successful: 1, failed: 0 },
  { month: "Nov", wipes: 3, successful: 3, failed: 0 },
  { month: "Dec", wipes: 4, successful: 3, failed: 1 },
  { month: "Jan", wipes: 2, successful: 2, failed: 0 },
  { month: "Feb", wipes: 5, successful: 4, failed: 1 },
  { month: "Mar", wipes: 4, successful: 4, failed: 0 },
  { month: "Apr", wipes: 6, successful: 5, failed: 1 },
  { month: "May", wipes: 5, successful: 5, failed: 0 },
  { month: "Jun", wipes: 7, successful: 6, failed: 1 },
  { month: "Jul", wipes: 6, successful: 6, failed: 0 },
  { month: "Aug", wipes: 8, successful: 7, failed: 1 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-white font-medium">{`${label}`}</p>
        <p className="text-blue-400">{`Total Wipes: ${payload[0].value}`}</p>
        {payload[0].payload.successful && (
          <p className="text-green-400">{`Successful: ${payload[0].payload.successful}`}</p>
        )}
        {payload[0].payload.failed > 0 && <p className="text-red-400">{`Failed: ${payload[0].payload.failed}`}</p>}
      </div>
    )
  }
  return null
}

export function WipeActivityChart() {
  const totalWipes = data.reduce((sum, item) => sum + item.wipes, 0)
  const avgWipes = Math.round(totalWipes / data.length)

  return (
    <Card className="bg-gray-800/60 border-gray-700 h-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Wipe Activity
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span>Avg: {avgWipes}/month</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="wipeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="wipes"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#wipeGradient)"
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#3b82f6", stroke: "#1f2937", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-white">{totalWipes}</div>
            <div className="text-xs text-gray-400">Total Wipes</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-green-400">
              {data.reduce((sum, item) => sum + item.successful, 0)}
            </div>
            <div className="text-xs text-gray-400">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-red-400">
              {data.reduce((sum, item) => sum + item.failed, 0)}
            </div>
            <div className="text-xs text-gray-400">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-blue-400">
              {Math.round((data.reduce((sum, item) => sum + item.successful, 0) / totalWipes) * 100)}%
            </div>
            <div className="text-xs text-gray-400">Success Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
