"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

export function DriveFilters() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search drives by name, serial, or model..." className="pl-10" />
            </div>
          </div>

          <div className="flex gap-3">
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="wiping">Wiping</SelectItem>
                <SelectItem value="encrypted">Encrypted</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ssd">SSD</SelectItem>
                <SelectItem value="hdd">HDD</SelectItem>
                <SelectItem value="usb">USB</SelectItem>
                <SelectItem value="nvme">NVMe</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <Badge variant="secondary" className="gap-1">
            Status: Wiping
            <X className="w-3 h-3 cursor-pointer" />
          </Badge>
          <Badge variant="secondary" className="gap-1">
            Type: SSD
            <X className="w-3 h-3 cursor-pointer" />
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
