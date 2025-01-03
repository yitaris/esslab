import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xejohommatfpxmfpaehz.supabase.co"; // Supabase'den alın
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlam9ob21tYXRmcHhtZnBhZWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NTc4MzksImV4cCI6MjA1MTQzMzgzOX0.3_WEeXkzVrY8F_Q0xwvTd1bnK4IjJo8sU3k_lwaXJQ4"; // Supabase'den alın

export const supabase = createClient(supabaseUrl, supabaseKey);
