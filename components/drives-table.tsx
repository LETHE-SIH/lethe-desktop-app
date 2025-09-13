"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Play, Square, AlertTriangle, CheckCircle, HardDrive } from "lucide-react"
import { WipeConfigModal } from "./wipe-config-modal"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

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
  path: string
  device: string
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
  const { toast, toasts } = useToast()

  // -------------------- Fetch Disks & Poll Wipe Status --------------------
  useEffect(() => {
    const fetchDisks = async () => {
      try {
        const res = await fetch("http://172.20.10.3:8080/api/v1/public/getdisks")
        const data = await res.json()

        const mapped: Drive[] = data.physical_disks
          .filter((d: ApiDisk) => d.device.startsWith("/dev/"))
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
            path: d.path,
            device: d.device,
          }))

        setDrives(mapped)
      } catch (err) {
        console.error("Failed to fetch drives:", err)
      }
    }

    const fetchWipeStatus = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/public/wipe/status")
        const data = await res.json() // { currentDisk, running, startedAt }

        setDrives((prev) =>
          prev.map((drive) => {
            if (drive.device === data.currentDisk && data.running) {
              return { ...drive, status: "wiping", progress: 50 } // progress placeholder
            } else if (drive.status === "wiping" && drive.device !== data.currentDisk) {
              return { ...drive, status: "idle", progress: null }
            } else {
              return drive
            }
          })
        )
      } catch (err) {
        console.error("Failed to fetch wipe status:", err)
      }
    }

    fetchDisks()
    fetchWipeStatus()
    const interval = setInterval(() => {
      fetchDisks()
      fetchWipeStatus()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // -------------------- Handlers --------------------
  const handleStartWipe = async (drive: Drive) => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/public/wipe/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disk: drive.device, wipe_mode: 0 }),
      })

      if (!res.ok) throw new Error(`Failed with status ${res.status}`)

      toast({
        title: "✅ Wipe Started",
        description: `${drive.name} (${drive.device}) is now being wiped.`,
        duration: 4000,
      })

      setDrives((prev) =>
        prev.map((d) =>
          d.id === drive.id ? { ...d, status: "wiping", progress: 0 } : d
        )
      )
    } catch (err: any) {
      console.error("Wipe error:", err)
      toast({
        title: "❌ Wipe Failed",
        description: err.message || "Failed to start wipe",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleStartEncryption = async (drive: Drive) => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/public/encrypt/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drive: drive.path,
          encrypt: true,
          ciphers: ["AES"],
          wipe: false,
          wipe_mode: 0,
          disk: drive.device,
        }),
      })

      if (!res.ok) throw new Error(`Failed with status ${res.status}`)

      toast({
        title: "✅ Encryption Started",
        description: `${drive.name} (${drive.device}) is now being encrypted with AES.`,
        duration: 4000,
      })

      setDrives((prev) =>
        prev.map((d) =>
          d.id === drive.id ? { ...d, status: "wiping", method: "AES" } : d
        )
      )
    } catch (err: any) {
      console.error("Encryption error:", err)
      toast({
        title: "❌ Encryption Failed",
        description: err.message || "Something went wrong while starting encryption.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  // -------------------- Render --------------------
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
                        <div className="font-medium text-card-foreground">{drive.device}</div>
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
                          <div className="text-xs text-muted-foreground">{drive.usedPercent.toFixed(1)}%</div>
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
                        <DropdownMenuContent align="end" sideOffset={5} className="z-50">
                          <DropdownMenuItem onClick={() => handleStartEncryption(drive)}>
                            Start Encryption
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStartWipe(drive)}>
                            Start Wipe
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>Stop Encryption</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>Stop Wipe</DropdownMenuItem>
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
        onStartWipe={() => {}}
      />

      <ToastProvider>
        {toasts.map(({ id, title, description, variant, ...props }) => {
          const isError = variant === "destructive"
          const baseClasses = "grid gap-1 p-4 rounded-lg shadow-lg border flex items-start justify-between"
          const successClasses = "bg-green-500 text-white border-green-600"
          const errorClasses = "bg-red-500 text-white border-red-600"

          return (
            <Toast key={id} {...props} className={`${baseClasses} ${isError ? errorClasses : successClasses}`}>
              <div>
                {title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
                {description && <ToastDescription className="text-sm opacity-90">{description}</ToastDescription>}
              </div>
              <ToastClose className="text-white hover:text-gray-200" />
            </Toast>
          )
        })}
        <ToastViewport className="fixed top-4 right-4 flex flex-col gap-2 z-[100]" />
      </ToastProvider>
    </>
  )
}
