import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { openWhatsAppWithMessage, WHATSAPP_SUGGESTED_MESSAGES } from "@/lib/whatsapp";
import { toast } from "@/hooks/use-toast";

const CTASection = () => {
  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from('configuracoes')
        .select('whatsapp')
        .maybeSingle();
      
      if (data?.whatsapp) {
        setWhatsapp(data.whatsapp);
      }
    };
    fetchConfig();
  }, []);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(WHATSAPP_SUGGESTED_MESSAGES.cta);
    setCopied(true);
    toast({
      title: "Mensagem copiada!",
      description: "Cole no WhatsApp após abrir a conversa.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-primary/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
            Transforme a fachada da sua empresa em um{" "}
            <span className="text-gradient-gold">ativo de valor</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Sua empresa merece uma fachada que transmita profissionalismo, 
            confiança e modernidade. Fale conosco agora.
          </p>

          {/* CTA Button */}
          {whatsapp && (
      <div className="space-y-4">
        <Button
          size="lg"
          className="bg-gradient-gold text-primary-foreground font-bold px-10 py-7 text-lg hover:opacity-90 transition-opacity shadow-gold animate-pulse-gold"
          onClick={() => {
            openWhatsAppWithMessage(whatsapp, WHATSAPP_SUGGESTED_MESSAGES.cta);
            toast({
              title: "WhatsApp aberto",
              description: "A mensagem foi preenchida automaticamente.",
            });
          }}
        >
          Falar no WhatsApp
          <ArrowRight className="ml-2" size={22} />
        </Button>
      </div>
          )}

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Orçamento Gratuito</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Resposta em 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Atendimento Personalizado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
