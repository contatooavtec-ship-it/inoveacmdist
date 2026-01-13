import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente para produção
// NOTA: SUPABASE_URL e ANON_KEY são chaves PÚBLICAS (não secretas)
// São seguras para uso no cliente e protegidas por RLS no banco
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wfirooqymiwibvjoprmr.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaXJvb3F5bWl3aWJ2am9wcm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjA2NzAsImV4cCI6MjA4MTMzNjY3MH0.DfQ18QyUu5G2_L4bfRFUaJ8U_c37LxwP8MwlVDLERj8";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
