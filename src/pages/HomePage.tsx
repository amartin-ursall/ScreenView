import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useDiscovery } from '@/hooks/useDiscovery';
import { DeviceCard, DeviceCardSkeleton } from '@/components/DeviceCard';
import { motion } from 'framer-motion';
import { Download, Upload, Settings, Timer, X, MonitorUp } from 'lucide-react';
import { useWebRTC, useStreamingTimer } from '@/hooks/useWebRTC';
import { cn } from '@/lib/utils';
function Header() {
  const { localDevice } = useDiscovery();
  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-yellow-400 flex items-center justify-center">
          <MonitorUp className="size-6 text-black" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tighter font-display">GraffiView</h1>
      </div>
      <div className="hidden md:flex items-center gap-2 rounded-full bg-card/80 px-4 py-1.5 border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-sm text-muted-foreground">Your IP:</span>
        <span className="text-sm font-mono font-medium text-foreground">{localDevice?.ip || '...'}</span>
      </div>
      <Button asChild variant="ghost" size="icon">
        <Link to="/settings"><Settings className="size-5" /></Link>
      </Button>
    </header>
  );
}
function QuickActions() {
  return (
    <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-semibold">Quick Actions</h2>
      <div className="flex flex-col space-y-4">
        <Button asChild size="lg" className="w-full justify-start gap-3 text-base py-6">
          <Link to="/share">
            <Upload className="size-5" />
            Share My Screen
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="w-full justify-start gap-3 text-base py-6">
          <Link to="#devices">
            <Download className="size-5" />
            View a Remote Screen
          </Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground text-center">Select a device from the list to view its screen.</p>
    </div>
  );
}
function TransmissionPanel() {
    const { isStreaming, stats, stopSharing } = useWebRTC();
    useStreamingTimer();
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    if (!isStreaming) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-80 md:w-96 p-4 rounded-xl shadow-glow glass z-50 border-primary/20"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </div>
                    <h3 className="font-semibold text-yellow-400">Transmission Active</h3>
                </div>
                <Button onClick={stopSharing} size="icon" variant="ghost" className="size-7 rounded-full hover:bg-red-500/20">
                    <X className="size-4 text-red-400" />
                </Button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                    <div className="text-xs text-muted-foreground">TIME</div>
                    <div className="text-lg font-mono font-bold">{formatTime(stats.elapsed)}</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">FPS</div>
                    <div className="text-lg font-mono font-bold">{stats.fps}</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">BITRATE</div>
                    <div className="text-lg font-mono font-bold">{(stats.bitrate / 1000).toFixed(1)}<span className="text-sm text-muted-foreground">Mbps</span></div>
                </div>
            </div>
        </motion.div>
    );
}
export function HomePage() {
  const { devices, isDiscovering } = useDiscovery();
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 hero-graphic opacity-30 dark:opacity-20" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="py-8 md:py-10 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 space-y-8 md:space-y-0">
            <div className="md:col-span-2 space-y-6">
              <h2 id="devices" className="text-2xl font-semibold tracking-tight">My Detected Devices</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isDiscovering && Array.from({ length: 4 }).map((_, i) => <DeviceCardSkeleton key={i} />)}
                {!isDiscovering && devices.map(device => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: devices.indexOf(device) * 0.05 }}
                  >
                    <DeviceCard device={device} />
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="md:col-span-1">
              <QuickActions />
            </div>
          </div>
        </main>
        <footer className="py-8 text-center text-muted-foreground/80">
          <p>Built with ❤️ at Cloudflare</p>
        </footer>
      </div>
      <TransmissionPanel />
      <Toaster richColors closeButton theme="dark" />
    </div>
  );
}