"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Play, Square, AlertTriangle, CheckCircle, HardDrive } from "lucide-react"
import { WipeConfigModal } from "./wipe-config-modal"
import { useState } from "react"

const drives = [
  {
    id: "SSD-001",
    name: "Samsung 970 EVO",
    type: "NVMe SSD",
    capacity: "1TB",
    status: "wiping",
    progress: 75,
    method: "DoD 5220.22-M",
    timeRemaining: "2h 15m",
    client: "WS-012",
    lastActivity: "2 min ago",
  },
  {
    id: "HDD-007",
    name: "Seagate Barracuda",
    type: "HDD",
    capacity: "2TB",
    status: "warning",
    progress: 0,
    method: "-",
    timeRemaining: "-",
    client: "WS-008",
    lastActivity: "15 min ago",
  },
  {
    id: "SSD-003",
    name: "Kingston A400",
    type: "SATA SSD",
    capacity: "500GB",
    status: "completed",
    progress: 100,
    method: "NIST 800-88",
    timeRemaining: "-",
    client: "WS-015",
    lastActivity: "1h ago",
  },
  {
    id: "USB-004",
    name: "SanDisk Ultra",
    type: "USB 3.0",
    capacity: "64GB",
    status: "error",
    progress: 0,
    method: "-",
    timeRemaining: "-",
    client: "WS-003",
    lastActivity: "3h ago",
  },
  {
    id: "SSD-005",
    name: "Crucial MX500",
    type: "SATA SSD",
    capacity: "1TB",
    status: "idle",
    progress: 0,
    method: "-",
    timeRemaining: "-",
    client: "WS-021",
    lastActivity: "5 min ago",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "wiping":
      return <Play className="w-4 h-4" />
    case "completed":
      return <CheckCircle className="w-4 h-4" />
    case "error":
      return <AlertTriangle className="w-4 h-4" />
    case "warning":
      return <AlertTriangle className="w-4 h-4" />
    default:
      return <Square className="w-4 h-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "wiping":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "completed":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "error":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "warning":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function DrivesTable() {
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false)
  const [selectedDriveForWipe, setSelectedDriveForWipe] = useState<(typeof drives)[0] | undefined>()

  const handleStartWipe = (drive: (typeof drives)[0]) => {
    setSelectedDriveForWipe(drive)
    setIsWipeModalOpen(true)
  }

  const handleWipeConfig = (config: any) => {
    console.log("[v0] Starting wipe with config:", config)
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Connected Drives ({drives.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Drive</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[80px]">Capacity</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Progress</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">Method</TableHead>
                  <TableHead className="min-w-[80px] hidden lg:table-cell">Client</TableHead>
                  <TableHead className="min-w-[100px] hidden xl:table-cell">Last Activity</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drives.map((drive) => (
                  <TableRow key={drive.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-card-foreground">{drive.id}</div>
                        <div className="text-sm text-muted-foreground">{drive.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {drive.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-card-foreground">{drive.capacity}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(drive.status)}>
                        {getStatusIcon(drive.status)}
                        <span className="ml-1 capitalize">{drive.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {drive.progress > 0 ? (
                        <div className="space-y-1">
                          <Progress value={drive.progress} className="w-16 md:w-20" />
                          <div className="text-xs text-muted-foreground">{drive.progress}%</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-card-foreground hidden md:table-cell">{drive.method}</TableCell>
                    <TableCell className="text-card-foreground hidden lg:table-cell">{drive.client}</TableCell>
                    <TableCell className="text-muted-foreground hidden xl:table-cell">{drive.lastActivity}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStartWipe(drive)}>Start Wipe</DropdownMenuItem>
                          <DropdownMenuItem>Stop Wipe</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Export Report</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remove Drive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <WipeConfigModal
        isOpen={isWipeModalOpen}
        onClose={() => setIsWipeModalOpen(false)}
        selectedDrive={selectedDriveForWipe}
        availableDrives={drives}
        onStartWipe={handleWipeConfig}
      />
    </>
  )
}
