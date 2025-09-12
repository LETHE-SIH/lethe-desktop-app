import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Cpu, HardDrive, Wifi, Server, Terminal } from "lucide-react";

type DeviceData = {
  device_id: string;
  status: string;
  cpu_model: string;
  cpu_cores: number;
  cpu_threads: number;
  memory: string;
  disk: string;
  ip_address: string;
  network_type: string;
  hostname: string;
  os_platform: string;
  os_version: string;
};

export function DeviceInfo() {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/public/profile")
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setDeviceData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading device info...</div>;
  if (error) return <div>Error loading device info: {error}</div>;
  if (!deviceData) return null;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Device Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic device info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Device ID</div>
            <div className="font-medium text-card-foreground">
              {deviceData.device_id}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <Badge className={`bg-green-500/10 text-green-500`}>
              {deviceData.status}
            </Badge>
          </div>
        </div>

        {/* CPU */}
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-card-foreground">
              {deviceData.cpu_model.trim()}
            </div>
            <div className="text-xs text-muted-foreground">
              {deviceData.cpu_cores} cores, {deviceData.cpu_threads} threads
            </div>
          </div>
        </div>

        {/* Memory and Disk */}
        <div className="flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-card-foreground">
              {deviceData.memory}
            </div>
            <div className="text-xs text-muted-foreground">
              {deviceData.disk} SSD
            </div>
          </div>
        </div>

        {/* Network */}
        <div className="flex items-center gap-3">
          <Wifi className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-card-foreground">
              {deviceData.ip_address}
            </div>
            <div className="text-xs text-muted-foreground">
              {deviceData.network_type}
            </div>
          </div>
        </div>

        {/* Hostname */}
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-card-foreground">
              {deviceData.hostname}
            </div>
            <div className="text-xs text-muted-foreground">Hostname</div>
          </div>
        </div>

        {/* OS */}
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-card-foreground">
              {deviceData.os_platform}
            </div>
            <div className="text-xs text-muted-foreground">
              Version: {deviceData.os_version}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border text-xs text-muted-foreground">
          Drive Wiper v2.1.0 • Last updated: 2024-01-15
        </div>
      </CardContent>
    </Card>
  );
}
