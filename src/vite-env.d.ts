/// <reference types="vite/client" />

/**
 * Tipagem das variáveis de ambiente do Vite
 * Todas as variáveis devem ter prefixo VITE_ para serem expostas ao cliente
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
