import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Expand, Shrink, Camera, Video, Mic, MousePointer, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiscovery } from '@/hooks/useDiscovery';
import { useFullscreen } from 'react-use';
import { toast } from 'sonner';
export function ViewScreen() {
  const { deviceId } = useParams();
  const { devices } = useDiscovery();
  const device = devices.find(d => d.id === deviceId);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const show = useFullscreen(videoContainerRef, isFullScreen, { onClose: () => setIsFullScreen(false) });
  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const link = document.createElement('a');
      link.download = `capture-${device?.name}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success("Screenshot captured!");
    }
  };
  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      <header className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="bg-transparent hover:bg-white/10 border-white/20">
            <Link to="/"><ArrowLeft className="size-4" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Viewing: {device?.name || 'Unknown Device'}</h1>
            <p className="text-sm text-muted-foreground">{device?.ip}</p>
          </div>
        </div>
        <Button onClick={() => setIsFullScreen(!isFullScreen)} variant="outline" size="icon" className="bg-transparent hover:bg-white/10 border-white/20">
          {isFullScreen ? <Shrink className="size-4" /> : <Expand className="size-4" />}
        </Button>
      </header>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        <div ref={videoContainerRef} className="lg:col-span-3 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-contain" autoPlay loop muted poster="https://via.placeholder.com/1280x720/000000/111111?text=Waiting+for+stream...">
            {/* In a real scenario, a MediaStream would be attached here. For demo, we can use a placeholder video. */}
            <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-gray-900/50 border-white/10">
            <CardHeader><CardTitle>Controls</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button onClick={handleCapture} variant="outline" className="bg-transparent hover:bg-white/10 border-white/20"><Camera className="size-4 mr-2" /> Capture</Button>
              <Button variant="outline" className="bg-transparent hover:bg-white/10 border-white/20" onClick={() => toast.info("Recording feature coming soon!")}><Video className="size-4 mr-2" /> Record</Button>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-white/10">
            <CardHeader><CardTitle>Remote Control</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="bg-transparent hover:bg-white/10 border-white/20" onClick={() => toast.info("Requesting mouse control...")}><MousePointer className="size-4 mr-2" /> Mouse</Button>
              <Button variant="outline" className="bg-transparent hover:bg-white/10 border-white/20" onClick={() => toast.info("Requesting keyboard control...")}><Keyboard className="size-4 mr-2" /> Keyboard</Button>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-white/10">
            <CardHeader><CardTitle>Stream Info</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between"><span>Quality:</span> <span className="font-mono">1080p</span></div>
              <div className="flex justify-between"><span>FPS:</span> <span className="font-mono">29.97</span></div>
              <div className="flex justify-between"><span>Latency:</span> <span className="font-mono">~25ms</span></div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}