import { useRealtime } from '../contexts/RealtimeContext';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

export default function RealtimeStatus() {
  const { isConnected, lastUpdate } = useRealtime();

  return (
    <div className="flex items-center space-x-2">
      <Badge 
        variant={isConnected ? "default" : "destructive"}
        className="flex items-center space-x-1"
      >
        {isConnected ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        <span className="text-xs">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </Badge>
      {lastUpdate && (
        <span className="text-xs text-gray-500">
          Updated {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}