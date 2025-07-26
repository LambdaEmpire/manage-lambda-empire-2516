import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvsfdoesslskumujvafd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2c2Zkb2Vzc2xza3VtdWp2YWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE3Nzg0MzcsImV4cCI6MjAzNzM1NDQzN30.Hs_lR7_vJlbKGBKGVJBXhJJmJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);