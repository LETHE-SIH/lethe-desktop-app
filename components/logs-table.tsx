"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Info, AlertTriangle, XCircle, Bug, FileText, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

const logs = [
  {
    id: "LOG-001",
    timestamp: "2024-01-15 14:32:15.234",
    level: "ERROR",
    source: "wipe-engine",
    client: "WS-004",
    drive: "USB-004",
    message: "Failed to initialize wipe on drive USB-004 - device disconnected during operation",
    details: "Stack trace: WipeEngine.initialize() -> DriveManager.connect() -> USB device timeout after 30s",
    category: "Hardware",
  },
  {
    id: "LOG-002",
    timestamp: "2024-01-15 14:28:42.156",
    level: "WARNING",
    source: "system",
    client: "WS-007",
    drive: "HDD-007",
    message: "Drive HDD-007 showing bad sectors during verification phase",
    details: "Bad sectors detected at LBA: 2048576, 2048832, 2049088. Recommend hardware replacement.",
    category: "Hardware",
  },
  {
    id: "LOG-003",
    timestamp: "2024-01-15 14:15:33.789",
    level: "INFO",
    source: "wipe-engine",
    client: "WS-001",
    drive: "SSD-001",
    message: "Started secure wipe on drive SSD-001 using DoD 5220.22-M method",
    details: "Wipe parameters: 3-pass overwrite, verification enabled, estimated duration: 3h 45m",
    category: "Operation",
  },
  {
    id: "LOG-004",
    timestamp: "2024-01-15 13:45:21.445",
    level: "INFO",
    source: "client-manager",
    client: "WS-012",
    drive: null,
    message: "Client workstation WS-012 connected successfully",
    details: "Client info: Windows 11 Pro, IP: 192.168.1.45, User: john.smith@company.com",
    category: "Connection",
  },
  {
    id: "LOG-005",
    timestamp: "2024-01-15 13:22:18.667",
    level: "WARNING",
    source: "auth",
    client: "WS-008",
    drive: null,
    message: "Multiple failed authentication attempts from client WS-008",
    details: "5 failed attempts in 10 minutes. Client temporarily locked for security.",
    category: "Security",
  },
  {
    id: "LOG-006",
    timestamp: "2024-01-15 12:58:45.123",
    level: "INFO",
    source: "wipe-engine",
    client: "WS-003",
    drive: "SSD-003",
    message: "Wipe operation completed successfully on drive SSD-003",
    details: "Operation completed in 2h 34m. Verification passed. Certificate generated.",
    category: "Operation",
  },
  {
    id: "LOG-007",
    timestamp: "2024-01-15 12:45:12.890",
    level: "DEBUG",
    source: "system",
    client: null,
    drive: null,
    message: "System health check completed - all services running normally",
    details: "CPU: 23%, Memory: 45%, Disk: 67%, Network: Normal",
    category: "System",
  },
]

const getLevelIcon = (level: string) => {
  switch (level) {
    case "ERROR":
      return <XCircle className="w-4 h-4" />
    case "WARNING":
      return <AlertTriangle className="w-4 h-4" />
    case "INFO":
      return <Info className="w-4 h-4" />
    case "DEBUG":
      return <Bug className="w-4 h-4" />
    default:
      return <Info className="w-4 h-4" />
  }
}

const getLevelColor = (level: string) => {
  switch (level) {
    case "ERROR":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "WARNING":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    case "INFO":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "DEBUG":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getCategoryColor = (category: string) => {
  const colors = {
    Hardware: "bg-red-500/10 text-red-500",
    Operation: "bg-green-500/10 text-green-500",
    Connection: "bg-blue-500/10 text-blue-500",
    Security: "bg-purple-500/10 text-purple-500",
    System: "bg-gray-500/10 text-gray-500",
  }
  return colors[category as keyof typeof colors] || "bg-gray-500/10 text-gray-500"
}

export function LogsTable() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <FileText className="w-5 h-5" />
          System Logs ({logs.length} entries)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="min-w-[140px]">Timestamp</TableHead>
                  <TableHead className="min-w-[80px]">Level</TableHead>
                  <TableHead className="min-w-[100px]">Source</TableHead>
                  <TableHead className="min-w-[80px] hidden md:table-cell">Client</TableHead>
                  <TableHead className="min-w-[80px] hidden lg:table-cell">Drive</TableHead>
                  <TableHead className="min-w-[200px]">Message</TableHead>
                  <TableHead className="min-w-[100px] hidden xl:table-cell">Category</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <>
                    <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleRow(log.id)} className="p-0 h-6 w-6">
                          {expandedRows.has(log.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-xs md:text-sm text-muted-foreground">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(log.level)}>
                          {getLevelIcon(log.level)}
                          <span className="ml-1">{log.level}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {log.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-card-foreground hidden md:table-cell">{log.client || "-"}</TableCell>
                      <TableCell className="text-card-foreground hidden lg:table-cell">{log.drive || "-"}</TableCell>
                      <TableCell className="max-w-[150px] md:max-w-md truncate text-card-foreground text-sm">
                        {log.message}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <Badge variant="outline" className={getCategoryColor(log.category)}>
                          {log.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Copy Message</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Export Entry</DropdownMenuItem>
                            <DropdownMenuItem>Create Alert</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(log.id) && (
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell colSpan={8} className="md:colSpan-8 lg:colSpan-8 xl:colSpan-8">
                          <div className="bg-muted/30 p-3 md:p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:hidden gap-2 mb-3 text-sm">
                              <div>
                                <strong>Client:</strong> {log.client || "N/A"}
                              </div>
                              <div>
                                <strong>Drive:</strong> {log.drive || "N/A"}
                              </div>
                              <div>
                                <strong>Category:</strong>
                                <Badge variant="outline" className={`ml-2 ${getCategoryColor(log.category)}`}>
                                  {log.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-card-foreground">
                              <strong>Details:</strong>
                            </div>
                            <div className="text-xs md:text-sm text-muted-foreground mt-1 font-mono break-words">
                              {log.details}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
