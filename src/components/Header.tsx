import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    const { data } = await supabase
      .from('configuracoes')
      .select('logo_url')
      .maybeSingle();
    
    if (data?.logo_url) {
      setLogoUrl(data.logo_url);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/servicos", label: "Serviços" },
    { href: "/portfolio", label: "Portfólio" },
    { href: "/orcamento", label: "Orçamento" },
    { href: "/contato", label: "Contato" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {logoUrl && (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                <img 
                  src={logoUrl} 
                  alt="INOVEACM" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <span className="text-2xl md:text-3xl font-heading font-bold">
              <span className="text-foreground">INOVE</span>
              <span className="text-gradient-gold">ACM</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-medium transition-colors duration-300 hover:text-primary ${
                  isActive(link.href) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Admin
              </Button>
            </Link>
            <Link to="/orcamento">
              <Button className="bg-gradient-gold text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                Solicitar Orçamento
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-medium py-2 transition-colors duration-300 hover:text-primary ${
                    isActive(link.href) ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                  Admin
                </Button>
              </Link>
              <Link to="/orcamento" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-gradient-gold text-primary-foreground font-semibold">
                  Solicitar Orçamento
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
