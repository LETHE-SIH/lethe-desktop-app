"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Info, AlertTriangle, XCircle, Bug, FileText, ChevronDown, ChevronRight } from "lucide-react"

type LogEntry = {
  id: string
  timestamp: string
  level: string
  source: string
  client: string
  drive: string
  message: string
  details: string
  category: string
}

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

// 🔎 Guess source & category based on message keywords
const detectSourceAndCategory = (msg: string) => {
  if (msg.includes("Encrypted") || msg.includes("encryption")) {
    return { source: "crypto-engine", category: "Operation" }
  }
  if (msg.includes("Skipping system/hidden")) {
    return { source: "system", category: "System" }
  }
  return { source: "unknown", category: "Operation" }
}

export function LogsTable() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch("https://lethe-api.zerodev.me/api/v1/public/logsfull")
      .then((res) => res.json())
      .then((data) => {
        const parsedLogs = data.last_n.map((raw: string, idx: number) => {
          // Example: "2025-09-11T23:29:19+05:30 INFO:Encrypted ..."
          const [datetime, rest] = raw.split(" ", 2)
          const levelMatch = raw.match(/(INFO|ERROR|WARNING|DEBUG)/)
          const level = levelMatch ? levelMatch[1] : "INFO"

          const msgStart = raw.indexOf(level) + level.length + 1
          const message = raw.substring(msgStart).trim()

          const { source, category } = detectSourceAndCategory(message)

          // Try to extract drive (e.g., "drive K:")
          const driveMatch = raw.match(/drive\s+([A-Z]:)/)
          const drive = driveMatch ? driveMatch[1] : "-"

          return {
            id: `LOG-${idx + 1}`,
            timestamp: datetime,
            level,
            source,
            client: "localhost",
            drive,
            message,
            details: raw,
            category,
          } as LogEntry
        })
        setLogs(parsedLogs)
      })
      .catch((err) => console.error("Failed to fetch logs:", err))
  }, [])

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id)
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
                          {expandedRows.has(log.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-xs md:text-sm text-muted-foreground">{log.timestamp}</TableCell>
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
                      <TableCell className="text-card-foreground hidden md:table-cell">{log.client}</TableCell>
                      <TableCell className="text-card-foreground hidden lg:table-cell">{log.drive}</TableCell>
                      <TableCell className="max-w-[150px] md:max-w-md truncate text-card-foreground text-sm">{log.message}</TableCell>
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
                        <TableCell colSpan={8}>
                          <div className="bg-muted/30 p-3 md:p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:hidden gap-2 mb-3 text-sm">
                              <div>
                                <strong>Client:</strong> {log.client}
                              </div>
                              <div>
                                <strong>Drive:</strong> {log.drive}
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
