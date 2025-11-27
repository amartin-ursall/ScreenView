import { Link } from 'react-router-dom';
import { ArrowLeft, Palette, Wifi, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ThemeToggle';
export function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="icon">
            <Link to="/"><ArrowLeft className="size-4" /></Link>
          </Button>
          <h1 className="text-3xl font-bold font-display">Settings</h1>
        </div>
        <div className="space-y-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Wifi className="size-6" />
                <div>
                  <CardTitle className="text-xl">Network</CardTitle>
                  <CardDescription>Configure how GraffiView discovers devices on your network.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="local-ip">Local IP Address</Label>
                  <Input id="local-ip" value="192.168.1.101" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Service Port</Label>
                  <Input id="port" defaultValue="9000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Discovery Mode</Label>
                <Select defaultValue="auto">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatic (mDNS / UDP)</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Shield className="size-6" />
                <div>
                  <CardTitle className="text-xl">Security</CardTitle>
                  <CardDescription>Manage device access and connection security.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="require-pin" className="text-base">Require PIN for connections</Label>
                  <p className="text-sm text-muted-foreground">New devices will need a PIN to connect.</p>
                </div>
                <Switch id="require-pin" />
              </div>
              <div>
                <Label>Trusted Devices</Label>
                <div className="mt-2 border rounded-lg p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">No trusted devices yet.</p>
                  <Button variant="secondary">Add Device Manually</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Palette className="size-6" />
                <div>
                  <CardTitle className="text-xl">Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of the application.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
                </div>
                <ThemeToggle className="relative top-0 right-0" />
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-2 border-yellow-400">Default</Button>
                    <Button variant="outline">Blue</Button>
                    <Button variant="outline">Green</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}