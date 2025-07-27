import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UseRealtimeDataOptions {
  table: string;
  select?: string;
  filter?: { column: string; value: any };
  orderBy?: { column: string; ascending?: boolean };
}

export function useRealtimeData<T = any>({
  table,
  select = '*',
  filter,
  orderBy
}: UseRealtimeDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Initial data fetch
    const fetchData = async () => {
      try {
        setLoading(true);
        let query = supabase.from(table).select(select);

        if (filter) {
          query = query.eq(filter.column, filter.value);
        }

        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
        }

        const { data: initialData, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          setData(initialData || []);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
          console.error(`Error fetching ${table}:`, err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel(`${table}-realtime`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => {
          if (!isMounted) return;

          console.log(`Real-time update for ${table}:`, payload);

          if (payload.eventType === 'INSERT') {
            setData(current => {
              const newItem = payload.new as T;
              // Check if item already exists to avoid duplicates
              const exists = current.some((item: any) => item.id === (newItem as any).id);
              if (exists) return current;
              
              return [...current, newItem];
            });
          } else if (payload.eventType === 'UPDATE') {
            setData(current =>
              current.map((item: any) =>
                item.id === payload.new.id ? { ...item, ...payload.new } : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData(current =>
              current.filter((item: any) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [table, select, filter?.column, filter?.value, orderBy?.column, orderBy?.ascending]);

  return { data, loading, error, refetch: () => setLoading(true) };
}