import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AnalyticsType = 'page_view' | 'orcamento' | 'whatsapp' | 'instagram';

// Hash simples para anonimizar IP (não armazenamos IP real)
const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const trackEvent = async (tipo: AnalyticsType, pagina?: string) => {
  try {
    // Cria um hash baseado em user agent + timestamp do dia (para anonimização)
    const today = new Date().toDateString();
    const ipHash = await hashString(navigator.userAgent + today);

    await supabase.from('analytics').insert({
      tipo,
      pagina: pagina || window.location.pathname,
      ip_hash: ipHash,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

export const usePageView = (pagina?: string) => {
  useEffect(() => {
    trackEvent('page_view', pagina || window.location.pathname);
  }, [pagina]);
};

export const trackOrcamento = () => trackEvent('orcamento');
export const trackWhatsApp = () => trackEvent('whatsapp');
export const trackInstagram = () => trackEvent('instagram');
