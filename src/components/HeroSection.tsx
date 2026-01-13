import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_SUGGESTED_MESSAGES } from "@/lib/whatsapp";
import WhatsAppButton from "@/components/WhatsAppButton";

const HeroSection = () => {
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), 
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Líder em Soluções ACM
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 animate-slide-up">
            <span className="text-foreground">INOVE</span>
            <span className="text-gradient-gold">ACM</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Soluções em ACM para empresas que exigem{" "}
            <span className="text-foreground font-medium">alto padrão</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/orcamento">
              <Button 
                size="lg" 
                className="bg-gradient-gold text-primary-foreground font-semibold px-8 py-6 text-lg hover:opacity-90 transition-opacity shadow-gold"
              >
                Solicitar Orçamento
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            {whatsapp && (
              <WhatsAppButton
                whatsappNumber={whatsapp}
                suggestedMessage={WHATSAPP_SUGGESTED_MESSAGES.default}
                buttonText="WhatsApp"
                variant="outline"
                size="lg"
                className="border-primary/50 text-foreground font-semibold px-8 py-6 text-lg hover:bg-primary/10 hover:border-primary transition-all"
              />
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;