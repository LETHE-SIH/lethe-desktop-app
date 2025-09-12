"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type Log = {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  status: "error" | "warning" | "info" | "success";
};

function parseLogLine(line: string, id: number): Log | null {
  const firstSpace = line.indexOf(" ");
  if (firstSpace === -1) return null;
  const timestamp = line.substring(0, firstSpace);

  const rest = line.substring(firstSpace + 1);
  const colonIndex = rest.indexOf(":");
  if (colonIndex === -1) return null;
  const level = rest.substring(0, colonIndex).trim();
  const message = rest.substring(colonIndex + 1).trim();

  let status: Log["status"] = "info";
  switch (level.toUpperCase()) {
    case "ERROR":
      status = "error";
      break;
    case "WARNING":
      status = "warning";
      break;
    case "INFO":
      status = "success";
      break;
    default:
      status = "info";
  }

  return { id, timestamp, level, message, status };
}

export function LogsSection() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/public/logs");
        const data = await res.json();
        if (!isMounted) return;

        if (data.logs && Array.isArray(data.logs)) {
          const parsedLogs = data.logs
            .map((line: string, i: number) => parseLogLine(line, i + 1))
            .filter((log): log is Log => log !== null);

          setLogs(parsedLogs);
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };

    // initial fetch
    fetchLogs();

    // poll every 5 seconds
    const interval = setInterval(fetchLogs, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <Badge
                    variant={
                      log.status === "error"
                        ? "destructive"
                        : log.status === "warning"
                        ? "secondary"
                        : "default"
                    }
                    className="text-xs"
                  >
                    {log.level}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-card-foreground">
                      {log.message}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {log.timestamp}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No logs found.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
