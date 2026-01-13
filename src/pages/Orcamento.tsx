import { useState, useEffect } from "react";
import { trackOrcamento, trackWhatsApp, usePageView } from "@/hooks/useAnalytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { openWhatsAppWithMessage, WHATSAPP_SUGGESTED_MESSAGES } from "@/lib/whatsapp";
import { toast } from "@/hooks/use-toast";

interface Configuracoes {
  valor_m2: number;
  valor_minimo: number;
  valor_instalacao: number;
  valor_letreiro: number;
  whatsapp: string | null;
}

const BenefitCheckIcon = () => (
  <span
    aria-hidden="true"
    className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  </span>
);

const Orcamento = () => {
  usePageView();
  
  const [largura, setLargura] = useState<string>("");
  const [altura, setAltura] = useState<string>("");
  const [incluirInstalacao, setIncluirInstalacao] = useState(false);
  const [incluirLetreiro, setIncluirLetreiro] = useState(false);
  const [valorFinal, setValorFinal] = useState<number | null>(null);
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({
    valor_m2: 350,
    valor_minimo: 1500,
    valor_instalacao: 800,
    valor_letreiro: 1200,
    whatsapp: null,
  });

  useEffect(() => {
    const fetchConfiguracoes = async () => {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .maybeSingle();
      
      if (data && !error) {
        setConfiguracoes({
          valor_m2: data.valor_m2 || 350,
          valor_minimo: data.valor_minimo || 1500,
          valor_instalacao: data.valor_instalacao || 800,
          valor_letreiro: data.valor_letreiro || 1200,
          whatsapp: data.whatsapp || null,
        });
      }
    };

    fetchConfiguracoes();
  }, []);

  const calcularOrcamento = () => {
    const larg = parseFloat(largura) || 0;
    const alt = parseFloat(altura) || 0;
    
    if (larg <= 0 || alt <= 0) {
      setValorFinal(null);
      return;
    }

    const area = larg * alt;
    let valor = area * configuracoes.valor_m2;

    if (incluirInstalacao) {
      valor += configuracoes.valor_instalacao;
    }

    if (incluirLetreiro) {
      valor += configuracoes.valor_letreiro;
    }

    if (valor < configuracoes.valor_minimo) {
      valor = configuracoes.valor_minimo;
    }

    setValorFinal(valor);
    trackOrcamento();
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getMensagemOrcamento = () => {
    const area = (parseFloat(largura) * parseFloat(altura)).toFixed(2);
    return WHATSAPP_SUGGESTED_MESSAGES.orcamento(
      largura,
      altura,
      area,
      incluirInstalacao,
      incluirLetreiro,
      formatarMoeda(valorFinal || 0)
    );
  };

 const enviarWhatsApp = () => {
   if (!configuracoes.whatsapp) return;
   
   trackWhatsApp();
   
    openWhatsAppWithMessage(configuracoes.whatsapp, getMensagemOrcamento());
 };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-dark" />
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Calcule agora
              </span>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mt-4 mb-6">
                Orçamento <span className="text-gradient-gold">Online</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Calcule o valor estimado do seu projeto em segundos. 
                Simples, rápido e sem compromisso.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-background rounded-3xl border border-border p-8 md:p-12 shadow-2xl">
                {/* Calculator Icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                  <Calculator className="text-primary" size={32} />
                </div>

                <h2 className="text-2xl font-heading font-bold text-center mb-8">
                  Informe as dimensões
                </h2>

                {/* Form */}
                <div className="space-y-6">
                  {/* Dimensions */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="largura" className="text-foreground mb-2 block">
                        Largura (metros)
                      </Label>
                      <Input
                        id="largura"
                        type="number"
                        placeholder="Ex: 5"
                        value={largura}
                        onChange={(e) => setLargura(e.target.value)}
                        className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="altura" className="text-foreground mb-2 block">
                        Altura (metros)
                      </Label>
                      <Input
                        id="altura"
                        type="number"
                        placeholder="Ex: 3"
                        value={altura}
                        onChange={(e) => setAltura(e.target.value)}
                        className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-12"
                      />
                    </div>
                  </div>

                  {/* Extras */}
                  <div className="pt-4 space-y-4">
                    <h3 className="font-heading font-semibold text-lg">Adicionais</h3>
                    
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="instalacao" 
                        checked={incluirInstalacao}
                        onCheckedChange={(checked) => setIncluirInstalacao(checked as boolean)}
                        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="instalacao" className="text-foreground cursor-pointer">
                        Incluir instalação ({formatarMoeda(configuracoes.valor_instalacao)})
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="letreiro" 
                        checked={incluirLetreiro}
                        onCheckedChange={(checked) => setIncluirLetreiro(checked as boolean)}
                        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="letreiro" className="text-foreground cursor-pointer">
                        Incluir letreiro ({formatarMoeda(configuracoes.valor_letreiro)})
                      </Label>
                    </div>
                  </div>

                  {/* Calculate Button */}
                  <Button 
                    onClick={calcularOrcamento}
                    className="w-full bg-gradient-gold text-primary-foreground font-semibold h-14 text-lg hover:opacity-90 transition-opacity"
                  >
                    Calcular Orçamento
                  </Button>

                  {/* Result */}
                  {valorFinal !== null && (
                    <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 animate-fade-in">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">Valor estimado:</p>
                        <p className="text-4xl md:text-5xl font-heading font-bold text-gradient-gold">
                          {formatarMoeda(valorFinal)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-4">
                          * Valor mínimo: {formatarMoeda(configuracoes.valor_minimo)}
                        </p>
                      </div>

                      {/* Mensagem sugerida */}
                      <div className="mt-6 p-4 bg-background/50 rounded-xl border border-border">
                        <p className="text-sm text-muted-foreground mb-2">Mensagem para WhatsApp:</p>
                        <p className="text-xs text-foreground whitespace-pre-line mb-3">
                          {getMensagemOrcamento()}
                        </p>
                      </div>

                      <Button 
                        onClick={enviarWhatsApp}
                        className="w-full mt-4 bg-gradient-gold text-primary-foreground font-semibold h-14 text-lg hover:opacity-90 transition-opacity"
                      >
                        Abrir WhatsApp
                        <ArrowRight className="ml-2" size={20} />
                      </Button>

                      <p className="text-xs text-muted-foreground text-center mt-3">
                        A mensagem será carregada automaticamente ao abrir o WhatsApp.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Benefits */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    "Orçamento gratuito",
                    "Sem compromisso",
                    "Resposta imediata"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center justify-center gap-3 text-muted-foreground">
                      <BenefitCheckIcon />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Orcamento;
