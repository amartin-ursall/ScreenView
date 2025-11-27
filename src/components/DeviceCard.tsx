import { Monitor, Smartphone, Tv, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Device } from '@/hooks/useDiscovery';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { Link } from 'react-router-dom';
interface DeviceCardProps {
  device: Device;
}
const getStatusStyles = (status: Device['status']) => {
  switch (status) {
    case 'available':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'occupied':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'unavailable':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};
const getDeviceIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('tv') || lowerName.includes('living room')) return <Tv className="size-6 text-muted-foreground" />;
    if (lowerName.includes('phone') || lowerName.includes('mobile')) return <Smartphone className="size-6 text-muted-foreground" />;
    return <Monitor className="size-6 text-muted-foreground" />;
};
export function DeviceCard({ device }: DeviceCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="flex items-center gap-4">
          {getDeviceIcon(device.name)}
          <div>
            <CardTitle className="text-lg font-semibold">{device.name}</CardTitle>
            <CardDescription>{device.ip}</CardDescription>
          </div>
        </div>
        <Badge variant="outline" className={cn("capitalize", getStatusStyles(device.status))}>
          {device.status}
        </Badge>
      </CardHeader>
      <CardContent className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {device.status !== 'unavailable' ? <Wifi className="size-4 text-green-400" /> : <WifiOff className="size-4 text-gray-500" />}
          <span>{device.isLocal ? 'This Device' : 'Remote'}</span>
        </div>
        {!device.isLocal && device.status === 'occupied' && (
          <Button asChild size="sm" variant="secondary">
            <Link to={`/view/${device.id}`}>View Screen</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
export function DeviceCardSkeleton() {
    return (
        <Card className="bg-card/50">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-4">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-9 w-24 rounded-md" />
            </CardContent>
        </Card>
    );
}