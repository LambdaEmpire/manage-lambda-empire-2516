import { useState, useEffect, useCallback } from 'react';
import { connectionHealth } from '../lib/optimizedSupabase';

interface ConnectionState {
  isOnline: boolean;
  latency: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  region: string;
}

export const useConnectionOptimizer = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isOnline: navigator.onLine,
    latency: 0,
    quality: 'good',
    region: 'us-east-1'
  });

  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const assessConnectionQuality = useCallback((latency: number): ConnectionState['quality'] => {
    if (latency < 100) return 'excellent';
    if (latency < 300) return 'good';
    if (latency < 1000) return 'fair';
    return 'poor';
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const health = await connectionHealth.checkConnection();
      const optimalRegion = await connectionHealth.getOptimalRegion();
      
      setConnectionState(prev => ({
        ...prev,
        isOnline: health.healthy,
        latency: health.latency || 0,
        quality: assessConnectionQuality(health.latency || 0),
        region: optimalRegion.region
      }));

      setRetryCount(0); // Reset retry count on successful connection
    } catch (error) {
      console.error('Connection check failed:', error);
      
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        // Exponential backoff
        setTimeout(checkConnection, Math.pow(2, retryCount) * 1000);
      }
    }
  }, [assessConnectionQuality, retryCount, maxRetries]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setConnectionState(prev => ({ ...prev, isOnline: true }));
      checkConnection();
    };

    const handleOffline = () => {
      setConnectionState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial connection check
    checkConnection();

    // Periodic connection quality checks
    const interval = setInterval(checkConnection, 60000); // Every minute

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkConnection]);

  const getOptimizedRequestConfig = useCallback(() => {
    const { quality, latency } = connectionState;
    
    // Adjust timeouts based on connection quality
    const timeouts = {
      excellent: { timeout: 5000, retries: 1 },
      good: { timeout: 10000, retries: 2 },
      fair: { timeout: 15000, retries: 3 },
      poor: { timeout: 30000, retries: 5 }
    };

    return timeouts[quality];
  }, [connectionState]);

  return {
    connectionState,
    checkConnection,
    getOptimizedRequestConfig,
    isOptimalConnection: connectionState.quality === 'excellent' || connectionState.quality === 'good'
  };
};