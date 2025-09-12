"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Calendar } from "lucide-react"

export function LogsFilters() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search logs by message, client, or drive ID..." className="pl-10" />
            </div>
          </div>

          <div className="flex gap-3">
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="wipe-engine">Wipe Engine</SelectItem>
                <SelectItem value="client-manager">Client Manager</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <Badge variant="secondary" className="gap-1">
            Level: Error
            <X className="w-3 h-3 cursor-pointer" />
          </Badge>
          <Badge variant="secondary" className="gap-1">
            Last 24h
            <X className="w-3 h-3 cursor-pointer" />
          </Badge>
          <Button variant="ghost" size="sm" className="text-xs">
            Clear all
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
