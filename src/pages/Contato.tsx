import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Instagram, Mail, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { openWhatsAppWithMessage, WHATSAPP_SUGGESTED_MESSAGES } from "@/lib/whatsapp";
import { useEffect, useMemo, useState } from "react";
import { trackInstagram, usePageView } from "@/hooks/useAnalytics";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface Configuracoes {
  whatsapp: string | null;
  instagram: string | null;
  email: string | null;
  endereco: string | null;
  telefone: string | null;
}

const Contato = () => {
  usePageView();
  const [config, setConfig] = useState<Configuracoes | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("configuracoes")
        .select("whatsapp, telefone, email, instagram, endereco")
        .maybeSingle();

      if (data) {
        setConfig(data);
      }
    };

    fetchConfig();
  }, []);

  const formatInstagramUrl = (handle: string | null) => {
    if (!handle) return "#";
    return `https://instagram.com/${handle.replace("@", "")}`;
  };

  const contactItems = useMemo(() => {
    const sanitizedEmail = config?.email?.trim();
    const emailHref = sanitizedEmail ? `mailto:${sanitizedEmail}` : undefined;
    return [
      {
        label: "WhatsApp",
        value: config?.whatsapp || "WhatsApp em breve",
        icon: <WhatsAppIcon size={18} className="text-primary" />,
        action:
          config?.whatsapp &&
          (() =>
            openWhatsAppWithMessage(
              config.whatsapp,
              WHATSAPP_SUGGESTED_MESSAGES.contato
            )),
      },
      {
        label: "Telefone",
        value: config?.telefone || "Telefone indisponível",
        icon: <Phone size={18} className="text-primary" />,
      },
      {
        label: "Email",
        value: config?.email || "Email indisponível",
        icon: <Mail size={18} className="text-primary" />,
        href: emailHref,
        openInNewTab: false,
      },
      {
        label: "Instagram",
        value: config?.instagram || "Instagram indisponível",
        icon: <Instagram size={18} className="text-primary" />,
        href: config?.instagram
          ? formatInstagramUrl(config.instagram)
          : undefined,
        onClick: config?.instagram ? () => trackInstagram() : undefined,
      },
      {
        label: "Localização",
        value: config?.endereco || "Endereço indisponível",
        icon: <MapPin size={18} className="text-primary" />,
      },
    ];
  }, [config]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-dark" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Fale conosco
              </span>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mt-4 mb-6">
                <span className="text-gradient-gold">Contato</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Estamos prontos para atender você. Escolha um dos nossos canais
                e fale pelo WhatsApp com a mensagem preenchida automaticamente.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-8">
                  Nossos canais
                </h2>

                <div className="space-y-4">
                  {contactItems.map((item) => {
                    const content = (
                      <div className="flex items-center gap-4">
                        {item.icon}
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            {item.label}
                          </p>
                          <p className="text-sm text-foreground">{item.value}</p>
                        </div>
                      </div>
                    );

                    if (item.emailDisplay) {
                      return (
                        <div
                          key={item.label}
                          onClick={item.onClick}
                          role="link"
                          className="flex items-center gap-4 px-4 py-3 rounded-lg text-foreground cursor-pointer hover:text-primary transition-colors"
                        >
                          {content}
                        </div>
                      );
                    }

                    if (item.action) {
                      return (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className="w-full text-left p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all"
                        >
                          {content}
                        </button>
                      );
                    }

                    if (item.href) {
                      const openInNewTab = item.openInNewTab ?? true;
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target={openInNewTab ? "_blank" : undefined}
                          rel={openInNewTab ? "noopener noreferrer" : undefined}
                          onClick={item.onClick}
                          className="flex items-center gap-6 p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all"
                        >
                          {content}
                        </a>
                      );
                    }

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-6 p-6 rounded-2xl bg-background border border-border"
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
