"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Play, Square, AlertTriangle, CheckCircle, HardDrive } from "lucide-react"
import { WipeConfigModal } from "./wipe-config-modal"

type ApiDisk = {
  path: string
  used: number
  total: number
  used_percent: number
  device: string
  FileSystem: string
  LastTime: string
  physical_name: string
}

type Drive = {
  id: string
  name: string
  type: string
  capacity: string
  usedPercent: number | null
  status: string
  progress: number | null
  method: string
  client: string
  lastActivity: string
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "wiping":
      return <Play className="w-4 h-4" />
    case "completed":
      return <CheckCircle className="w-4 h-4" />
    case "error":
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
    case "idle":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const formatCapacity = (total: number) => {
  if (!total || total <= 0) return "-"
  const gb = total / 1024
  return gb > 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb.toFixed(1)} GB`
}

export function DrivesTable() {
  const [drives, setDrives] = useState<Drive[]>([])
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false)
  const [selectedDriveForWipe, setSelectedDriveForWipe] = useState<Drive | undefined>()

  useEffect(() => {
    const fetchDisks = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/public/getdisks")
        const data = await res.json()

        const mapped: Drive[] = data.physical_disks
          .filter((d: ApiDisk) => d.device.startsWith("/dev/")) // skip virtual mounts
          .map((d: ApiDisk, idx: number) => ({
            id: d.device || `disk-${idx}`,
            name: d.physical_name,
            type: "Local Disk",
            capacity: formatCapacity(d.total),
            usedPercent: d.total > 0 ? d.used_percent : null,
            status: "idle",
            progress: null,
            method: "-",
            client: "localhost",
            lastActivity: formatDistanceToNow(new Date(d.LastTime), { addSuffix: true }),
          }))

        setDrives(mapped)
      } catch (err) {
        console.error("Failed to fetch drives:", err)
      }
    }

    fetchDisks()
  }, [])

  const handleStartWipe = (drive: Drive) => {
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
                  <TableHead className="min-w-[100px]">Capacity</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Usage</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">Method</TableHead>
                  <TableHead className="min-w-[80px] hidden lg:table-cell">Client</TableHead>
                  <TableHead className="min-w-[120px] hidden xl:table-cell">Last Activity</TableHead>
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
                      {drive.usedPercent !== null ? (
                        <div className="space-y-1">
                          <Progress value={drive.usedPercent} className="w-24 md:w-32" />
                          <div className="text-xs text-muted-foreground">
                            {drive.usedPercent.toFixed(1)}%
                          </div>
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
