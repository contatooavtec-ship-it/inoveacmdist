import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Phone, Instagram, MapPin, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  openWhatsAppWithMessage,
  WHATSAPP_SUGGESTED_MESSAGES,
} from "@/lib/whatsapp";
import { trackInstagram } from "@/hooks/useAnalytics";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface Configuracoes {
  logo_url: string | null;
  whatsapp: string | null;
  telefone: string | null;
  email: string | null;
  instagram: string | null;
  endereco: string | null;
}

const Footer = () => {
  const [config, setConfig] = useState<Configuracoes | null>(null);
  const currentYear = new Date().getFullYear();
  const sanitizedEmail = config?.email?.trim();
  const emailHref = sanitizedEmail ? `mailto:${sanitizedEmail}` : undefined;

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const { data, error } = await supabase
      .from("configuracoes")
      .select("logo_url, whatsapp, telefone, email, instagram, endereco")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Erro ao buscar configurações", error.message);
      return;
    }

    const configRow = data?.[0];
    if (configRow) {
      setConfig(configRow);
    }
  };

  const formatInstagramUrl = (handle: string | null) => {
    if (!handle) return '#';
    const cleaned = handle.replace('@', '');
    return `https://instagram.com/${cleaned}`;
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              {config?.logo_url && (
              <div className="flex items-center h-12 md:h-14">
                <img
                  src={config.logo_url}
                  alt="Logo"
                  className="h-full object-contain"
                  style={{ backgroundColor: "transparent" }}
                />
              </div>
              )}
              <span className="text-3xl font-heading font-bold">
                <span className="text-foreground">INOVE</span>
                <span className="text-gradient-gold">ACM</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Soluções premium em ACM para empresas que exigem alto padrão. 
              Transformamos fachadas em ativos de valor com engenharia, 
              precisão e materiais de qualidade superior.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-primary">
              Links Rápidos
            </h4>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/servicos" className="text-muted-foreground hover:text-foreground transition-colors">
                Serviços
              </Link>
              <Link to="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                Portfólio
              </Link>
              <Link to="/orcamento" className="text-muted-foreground hover:text-foreground transition-colors">
                Orçamento
              </Link>
              <Link to="/contato" className="text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </Link>
            </nav>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-primary">
              Contato
            </h4>
            <div className="flex flex-col gap-4">
              {config?.whatsapp && (
                <button
                  onClick={() =>
                    openWhatsAppWithMessage(
                      config.whatsapp,
                      WHATSAPP_SUGGESTED_MESSAGES.contato
                    )
                  }
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <WhatsAppIcon size={18} className="text-primary" />
                  <span>{config.whatsapp}</span>
                </button>
              )}
              {config?.telefone && (
                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone size={18} className="text-primary" />
                  <span>{config.telefone}</span>
                </div>
              )}
              {config?.instagram && (
                <a
                  href={formatInstagramUrl(config.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackInstagram()}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram size={18} className="text-primary" />
                  <span>{config.instagram}</span>
                </a>
              )}
              {emailHref && (
                <a
                  href={emailHref}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail size={18} className="text-primary" />
                  <span>{config?.email}</span>
                </a>
              )}
              {config?.endereco && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin size={18} className="text-primary" />
                  <span>{config.endereco}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} INOVEACM. Todos os direitos reservados.
          </p>
          <p className="text-muted-foreground text-sm">
            Desenvolvido com excelência
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
