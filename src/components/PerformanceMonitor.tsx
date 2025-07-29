import React, { useEffect, useState } from 'react';
import { connectionHealth } from '../lib/optimizedSupabase';

interface PerformanceMetrics {
  connectionLatency: number;
  isHealthy: boolean;
  lastCheck: Date;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    const checkPerformance = async () => {
      const health = await connectionHealth.checkConnection();
      setMetrics({
        connectionLatency: health.latency || 0,
        isHealthy: health.healthy,
        lastCheck: new Date()
      });
    };

    // Initial check
    checkPerformance();

    // Periodic health checks
    const interval = setInterval(checkPerformance, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Only show in development or for admins
  if (process.env.NODE_ENV === 'production' && !showMetrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowMetrics(!showMetrics)}
        className="bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-50 hover:opacity-100"
      >
        Perf
      </button>
      
      {showMetrics && metrics && (
        <div className="absolute bottom-8 right-0 bg-black text-white p-2 rounded text-xs min-w-48">
          <div className="font-bold mb-1">Performance Metrics</div>
          <div>Status: {metrics.isHealthy ? '🟢 Healthy' : '🔴 Issues'}</div>
          <div>Latency: {metrics.connectionLatency}ms</div>
          <div>Last Check: {metrics.lastCheck.toLocaleTimeString()}</div>
        </div>
      )}
    </div>
  );
};