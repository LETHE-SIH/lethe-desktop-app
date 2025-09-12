import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings } from "lucide-react"

export function ProfileSettings() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">AD</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            Change Avatar
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Administrator" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="admin@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue="System Administrator" disabled />
          </div>
        </div>

        <Button className="w-full">Save Changes</Button>
      </CardContent>
    </Card>
  )
}
