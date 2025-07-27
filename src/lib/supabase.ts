import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvsfdoesslskumujvafd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2c2Zkb2Vzc2xza3VtdWp2YWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTU2MzcsImV4cCI6MjA2ODg5MTYzN30.n8F8TeqsMpMynOwwdanr5eg2bv7tpDxGGvAYwl7rvOA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});