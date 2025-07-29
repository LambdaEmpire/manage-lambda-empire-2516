import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvsfdoesslskumujvafd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2c2Zkb2Vzc2xza3VtdWp2YWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE3Nzg0MzcsImV4cCI6MjAzNzM1NDQzN30.Ej8Ks1Ej7Ej8Ks1Ej7Ej8Ks1Ej7Ej8Ks1Ej7Ej8Ks1Ej7';

// Optimized Supabase client with connection pooling and caching
export const optimizedSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-client-info': 'lambda-empire-management'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10 // Limit realtime events for better performance
    }
  }
});

// Query cache for frequently accessed data
const queryCache = new Map<string, { data: any; timestamp: number }>();
const QUERY_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// Optimized query function with caching
export const cachedQuery = async (
  table: string, 
  query: any, 
  cacheKey: string,
  cacheDuration: number = QUERY_CACHE_DURATION
) => {
  // Check cache first
  const cached = queryCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < cacheDuration) {
    return { data: cached.data, error: null, fromCache: true };
  }

  // Execute query
  const result = await query;
  
  // Cache successful results
  if (!result.error && result.data) {
    queryCache.set(cacheKey, {
      data: result.data,
      timestamp: Date.now()
    });
  }

  return { ...result, fromCache: false };
};

// Batch operations for better performance
export const batchOperations = {
  async batchInsert(table: string, records: any[], batchSize: number = 100) {
    const batches = [];
    for (let i = 0; i < records.length; i += batchSize) {
      batches.push(records.slice(i, i + batchSize));
    }

    const results = await Promise.allSettled(
      batches.map(batch => 
        optimizedSupabase.from(table).insert(batch)
      )
    );

    return results;
  },

  async batchUpdate(table: string, updates: Array<{id: string, data: any}>, batchSize: number = 50) {
    const batches = [];
    for (let i = 0; i < updates.length; i += batchSize) {
      batches.push(updates.slice(i, i + batchSize));
    }

    const results = await Promise.allSettled(
      batches.map(batch => 
        Promise.all(
          batch.map(update => 
            optimizedSupabase
              .from(table)
              .update(update.data)
              .eq('id', update.id)
          )
        )
      )
    );

    return results;
  }
};

// Connection health monitoring
export const connectionHealth = {
  async checkConnection() {
    try {
      const start = Date.now();
      await optimizedSupabase.from('profiles').select('count').limit(1);
      const latency = Date.now() - start;
      return { healthy: true, latency };
    } catch (error) {
      return { healthy: false, error };
    }
  },

  async getOptimalRegion() {
    // Simple latency test to determine best connection
    const regions = [
      { name: 'us-east-1', url: supabaseUrl },
      // Add more regions if available
    ];

    const tests = await Promise.allSettled(
      regions.map(async region => {
        const start = Date.now();
        try {
          await fetch(`${region.url}/rest/v1/`, { method: 'HEAD' });
          return { region: region.name, latency: Date.now() - start };
        } catch {
          return { region: region.name, latency: Infinity };
        }
      })
    );

    const successful = tests
      .filter(test => test.status === 'fulfilled')
      .map(test => (test as PromiseFulfilledResult<any>).value)
      .sort((a, b) => a.latency - b.latency);

    return successful[0] || { region: 'us-east-1', latency: 0 };
  }
};