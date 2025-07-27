import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tvsfdoesslskumujvafd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'PASTE_YOUR_REAL_ANON_KEY_HERE';

if (!supabaseUrl || supabaseAnonKey === 'PASTE_YOUR_REAL_ANON_KEY_HERE') {
  throw new Error('Please update your Supabase API key in src/lib/supabase.ts');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});