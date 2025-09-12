"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Monitor, MoreHorizontal, Wifi, WifiOff, HardDrive, User, Clock } from "lucide-react"

const clients = [
  {
    id: "WS-012",
    name: "Finance Workstation 1",
    user: "John Smith",
    ip: "192.168.1.45",
    status: "online",
    lastSeen: "Active now",
    drives: 2,
    activeOperations: 1,
    operationProgress: 75,
    os: "Windows 11 Pro",
    department: "Finance",
  },
  {
    id: "WS-008",
    name: "HR Laptop 3",
    user: "Sarah Johnson",
    ip: "192.168.1.32",
    status: "online",
    lastSeen: "2 min ago",
    drives: 1,
    activeOperations: 0,
    operationProgress: 0,
    os: "Windows 10 Pro",
    department: "HR",
  },
  {
    id: "WS-015",
    name: "Dev Machine 7",
    user: "Mike Chen",
    ip: "192.168.1.78",
    status: "offline",
    lastSeen: "1h ago",
    drives: 3,
    activeOperations: 0,
    operationProgress: 0,
    os: "Ubuntu 22.04",
    department: "IT",
  },
  {
    id: "WS-003",
    name: "Marketing Desktop",
    user: "Lisa Brown",
    ip: "192.168.1.19",
    status: "error",
    lastSeen: "3h ago",
    drives: 1,
    activeOperations: 0,
    operationProgress: 0,
    os: "macOS Ventura",
    department: "Marketing",
  },
  {
    id: "WS-021",
    name: "Sales Laptop 2",
    user: "David Wilson",
    ip: "192.168.1.56",
    status: "online",
    lastSeen: "Active now",
    drives: 2,
    activeOperations: 1,
    operationProgress: 45,
    os: "Windows 11 Pro",
    department: "Sales",
  },
  {
    id: "WS-009",
    name: "Admin Workstation",
    user: "Emma Davis",
    ip: "192.168.1.101",
    status: "online",
    lastSeen: "5 min ago",
    drives: 4,
    activeOperations: 0,
    operationProgress: 0,
    os: "Windows Server 2022",
    department: "IT",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "online":
      return <Wifi className="w-4 h-4" />
    case "offline":
      return <WifiOff className="w-4 h-4" />
    case "error":
      return <WifiOff className="w-4 h-4" />
    default:
      return <Monitor className="w-4 h-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "offline":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    case "error":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getDepartmentColor = (department: string) => {
  const colors = {
    Finance: "bg-blue-500/10 text-blue-500",
    HR: "bg-purple-500/10 text-purple-500",
    IT: "bg-green-500/10 text-green-500",
    Marketing: "bg-orange-500/10 text-orange-500",
    Sales: "bg-pink-500/10 text-pink-500",
  }
  return colors[department as keyof typeof colors] || "bg-gray-500/10 text-gray-500"
}

export function ClientsGrid() {
  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Connected Clients ({clients.length})
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="bg-card border-border hover:bg-card/80 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Monitor className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <CardTitle className="text-base md:text-lg text-card-foreground truncate">{client.id}</CardTitle>
                    <p className="text-sm text-muted-foreground truncate">{client.name}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Connect</DropdownMenuItem>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Remote Control</DropdownMenuItem>
                    <DropdownMenuItem>Export Logs</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <Badge className={getStatusColor(client.status)}>
                  {getStatusIcon(client.status)}
                  <span className="ml-1 capitalize">{client.status}</span>
                </Badge>
                <Badge variant="outline" className={getDepartmentColor(client.department)}>
                  {client.department}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-card-foreground truncate">{client.user}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wifi className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-card-foreground font-mono text-xs">{client.ip}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <HardDrive className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-card-foreground">{client.drives} drives detected</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{client.lastSeen}</span>
                </div>
              </div>

              {client.activeOperations > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Operation</span>
                    <span className="text-card-foreground">{client.operationProgress}%</span>
                  </div>
                  <Progress value={client.operationProgress} className="h-2" />
                </div>
              )}

              <div className="pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground truncate">{client.os}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
