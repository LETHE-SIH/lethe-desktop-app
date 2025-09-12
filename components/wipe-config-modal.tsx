"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HardDrive, Shield, Zap, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Drive {
  id: string
  name: string
  type: string
  capacity: string
  status: string
}

interface WipeConfigModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDrive?: Drive
  availableDrives: Drive[]
  onStartWipe: (config: WipeConfig) => void
}

interface WipeConfig {
  driveId: string
  wipeEnabled: boolean
  wipeMode: string
  encryptionEnabled: boolean
  encryptionAlgorithms: string[]
}

const wipeModesInfo = {
  single: { passes: 1, description: "Quick single pass overwrite", time: "Fast" },
  "3pass": { passes: 3, description: "DoD 5220.22-M standard", time: "Medium" },
  "7pass": { passes: 7, description: "NIST 800-88 compliant", time: "Slow" },
}

export function WipeConfigModal({
  isOpen,
  onClose,
  selectedDrive,
  availableDrives,
  onStartWipe,
}: WipeConfigModalProps) {
  const { toast } = useToast()

  const [config, setConfig] = useState<WipeConfig>({
    driveId: selectedDrive?.id || "",
    wipeEnabled: true,
    wipeMode: "3pass",
    encryptionEnabled: true,
    encryptionAlgorithms: ["AES"],
  })

  const handleAlgorithmChange = (algorithm: string, checked: boolean) => {
    setConfig((prev) => ({
      ...prev,
      encryptionAlgorithms: checked
        ? [...prev.encryptionAlgorithms, algorithm]
        : prev.encryptionAlgorithms.filter((a) => a !== algorithm),
    }))
  }

  const handleStartWipe = () => {
    onStartWipe(config)
    toast({
      title: "Wipe Started Successfully",
      description: `Secure wipe operation initiated on drive ${config.driveId}`,
      duration: 5000,
    })
    onClose()
  }

  const selectedDriveData = availableDrives.find((d) => d.id === config.driveId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Wipe Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Drive Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                Target Drive
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="drive-select">Select Drive</Label>
                <Select
                  value={config.driveId}
                  onValueChange={(value) => setConfig((prev) => ({ ...prev, driveId: value }))}
                >
                  <SelectTrigger id="drive-select">
                    <SelectValue placeholder="Choose a drive to wipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrives.map((drive) => (
                      <SelectItem key={drive.id} value={drive.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{drive.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {drive.type}
                          </Badge>
                          <span className="text-muted-foreground">({drive.capacity})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDriveData && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium">Name:</span> {selectedDriveData.name}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {selectedDriveData.type}
                    </div>
                    <div>
                      <span className="font-medium">Capacity:</span> {selectedDriveData.capacity}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge
                        className="ml-2 text-xs"
                        variant={selectedDriveData.status === "idle" ? "default" : "secondary"}
                      >
                        {selectedDriveData.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wipe Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Wipe Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="wipe-enabled">Enable Wipe</Label>
                  <div className="text-sm text-muted-foreground">Perform secure data overwriting</div>
                </div>
                <Switch
                  id="wipe-enabled"
                  checked={config.wipeEnabled}
                  onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, wipeEnabled: checked }))}
                />
              </div>

              {config.wipeEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="wipe-mode">Wipe Mode</Label>
                  <Select
                    value={config.wipeMode}
                    onValueChange={(value) => setConfig((prev) => ({ ...prev, wipeMode: value }))}
                  >
                    <SelectTrigger id="wipe-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">
                        <div className="space-y-1">
                          <div className="font-medium">Single Pass</div>
                          <div className="text-xs text-muted-foreground">
                            Quick overwrite - {wipeModesInfo.single.time}
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="3pass">
                        <div className="space-y-1">
                          <div className="font-medium">3 Pass (DoD 5220.22-M)</div>
                          <div className="text-xs text-muted-foreground">
                            Standard security - {wipeModesInfo["3pass"].time}
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="7pass">
                        <div className="space-y-1">
                          <div className="font-medium">7 Pass (NIST 800-88)</div>
                          <div className="text-xs text-muted-foreground">
                            Maximum security - {wipeModesInfo["7pass"].time}
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {config.wipeMode && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="text-sm">
                        <div className="font-medium text-blue-400">
                          {wipeModesInfo[config.wipeMode as keyof typeof wipeModesInfo].passes} Pass Method
                        </div>
                        <div className="text-muted-foreground mt-1">
                          {wipeModesInfo[config.wipeMode as keyof typeof wipeModesInfo].description}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Encryption Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Encryption Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="encryption-enabled">Enable Encryption</Label>
                  <div className="text-sm text-muted-foreground">Apply encryption before wiping</div>
                </div>
                <Switch
                  id="encryption-enabled"
                  checked={config.encryptionEnabled}
                  onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, encryptionEnabled: checked }))}
                />
              </div>

              {config.encryptionEnabled && (
                <div className="space-y-3">
                  <Label>Encryption Algorithms</Label>
                  <div className="space-y-2">
                    {["AES", "Serpent", "Twofish"].map((algorithm) => (
                      <div key={algorithm} className="flex items-center space-x-2">
                        <Checkbox
                          id={algorithm}
                          checked={config.encryptionAlgorithms.includes(algorithm)}
                          onCheckedChange={(checked) => handleAlgorithmChange(algorithm, checked as boolean)}
                        />
                        <Label htmlFor={algorithm} className="text-sm font-normal">
                          {algorithm}
                          {algorithm === "AES" && <span className="text-muted-foreground ml-1">(Recommended)</span>}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {config.encryptionAlgorithms.length > 0 && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="text-sm">
                        <div className="font-medium text-green-400">Selected Algorithms:</div>
                        <div className="text-muted-foreground mt-1">
                          {config.encryptionAlgorithms.join(", ")} encryption will be applied
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleStartWipe}
            disabled={
              !config.driveId ||
              (!config.wipeEnabled && !config.encryptionEnabled) ||
              (config.encryptionEnabled && config.encryptionAlgorithms.length === 0)
            }
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Start Wipe Operation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}