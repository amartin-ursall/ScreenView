import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Video, Volume2, X, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useDiscovery } from '@/hooks/useDiscovery';
import { useWebRTC } from '@/hooks/useWebRTC';
import { Device } from '@/hooks/useDiscovery';
import { toast } from 'sonner';
export function ShareScreen() {
  const navigate = useNavigate();
  const { devices } = useDiscovery();
  const { localStream, startLocalPreview, stopLocalPreview, startSharingTo } = useWebRTC();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (localStream && videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);
  const handleShare = () => {
    if (!localStream) {
      toast.error("No screen selected", { description: "Please select a screen or window to share." });
      return;
    }
    if (!selectedDeviceId) {
      toast.error("No device selected", { description: "Please choose a device to send your screen to." });
      return;
    }
    startSharingTo(selectedDeviceId);
    toast.success("Streaming started!", { description: `Your screen is being shared with the selected device.` });
    navigate('/');
  };
  const availableDevices = devices.filter(d => !d.isLocal && d.status === 'available');
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="icon">
            <Link to="/"><ArrowLeft className="size-4" /></Link>
          </Button>
          <h1 className="text-3xl font-bold font-display">Share My Screen</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Select Screen or Window</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed">
                  {localStream ? (
                    <div className="relative w-full h-full">
                      <video ref={videoRef} autoPlay muted className="w-full h-full object-contain rounded-lg" />
                      <Button onClick={stopLocalPreview} variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full size-8">
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground p-8">
                      <Monitor className="size-12 mx-auto mb-4" />
                      <p className="mb-4">Your screen preview will appear here.</p>
                      <Button onClick={startLocalPreview}>
                        <Video className="size-4 mr-2" />
                        Choose Screen
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>2. Configure Stream</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="audio-switch" className="text-base">Share Audio</Label>
                    <p className="text-sm text-muted-foreground">Include audio from your screen.</p>
                  </div>
                  <Switch id="audio-switch" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>FPS (Frames Per Second)</Label>
                  <Select defaultValue="30">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 FPS</SelectItem>
                      <SelectItem value="30">30 FPS</SelectItem>
                      <SelectItem value="60">60 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quality</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Codec</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="h264">H.264</SelectItem>
                      <SelectItem value="vp8">VP8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>3. Select Target Device</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedDeviceId || ''} onValueChange={setSelectedDeviceId}>
                  <div className="space-y-2">
                    {availableDevices.length > 0 ? availableDevices.map(device => (
                      <Label key={device.id} htmlFor={device.id} className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        <div>
                          <p className="font-semibold">{device.name}</p>
                          <p className="text-sm text-muted-foreground">{device.ip}</p>
                        </div>
                        <RadioGroupItem value={device.id} id={device.id} />
                      </Label>
                    )) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No available devices found.</p>
                    )}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            <Button size="lg" className="w-full text-lg py-7" onClick={handleShare} disabled={!localStream || !selectedDeviceId}>
              <Send className="size-5 mr-2" />
              Start Sharing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}