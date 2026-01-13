/**
 * Formata número de WhatsApp para URL wa.me com código do Brasil (55)
 * Link direto sem mensagem pré-definida - simples e estável
 */
export const formatWhatsAppUrl = (number: string | null): string => {
  if (!number) return '#';
  
  let cleaned = number.replace(/\D/g, '');
  
  // Adiciona código do país Brasil (55) se não tiver
  if (!cleaned.startsWith('55') && cleaned.length <= 11) {
    cleaned = '55' + cleaned;
  }
  
  return `https://wa.me/${cleaned}`;
};

/**
 * Abre WhatsApp em nova aba de forma segura
 */
export const openWhatsApp = (number: string | null): void => {
  const url = formatWhatsAppUrl(number);
  if (url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

export const openWhatsAppWithMessage = (number: string | null, message: string): void => {
  const baseUrl = formatWhatsAppUrl(number);
  if (baseUrl === '#') return;

  const separator = baseUrl.includes('?') ? '&' : '?';
  const encodedMessage = encodeURIComponent(message);
  window.open(`${baseUrl}${separator}text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
};

// Mensagens sugeridas para exibir na interface (cliente copia manualmente)
export const WHATSAPP_SUGGESTED_MESSAGES = {
  default: `Olá! Vim pelo site da INOVEACM e gostaria de mais informações sobre os serviços de fachadas em ACM. Podem me ajudar?`,
  cta: `Olá! Vim pelo site da INOVEACM e tenho interesse em transformar a fachada da minha empresa. Gostaria de agendar uma conversa para entender melhor os serviços e valores.`,
  orcamento: (largura: string, altura: string, area: string, incluirInstalacao: boolean, incluirLetreiro: boolean, valorFormatado: string) => 
    `Olá! Vim pelo site da INOVEACM.\n\n📐 Dimensões: ${largura}m x ${altura}m\n📏 Área total: ${area}m²\n${incluirInstalacao ? '✅ Com instalação\n' : '❌ Sem instalação\n'}${incluirLetreiro ? '✅ Com letreiro\n' : '❌ Sem letreiro\n'}💰 Valor estimado: ${valorFormatado}\n\nGostaria de confirmar os valores.`,
  contato: `Olá! Vim pelo site da INOVEACM e gostaria de entrar em contato.`,
};
