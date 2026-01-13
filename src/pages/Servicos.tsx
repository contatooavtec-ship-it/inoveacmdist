import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string | null;
}

const Servicos = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    const { data } = await supabase
      .from('servicos')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) {
      setServicos(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-dark" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                O que fazemos
              </span>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mt-4 mb-6">
                Nossos <span className="text-gradient-gold">Serviços</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Soluções completas em ACM e comunicação visual para transformar 
                a imagem da sua empresa.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : servicos.length === 0 ? (
              <p className="text-center text-muted-foreground py-16">
                Nenhum serviço cadastrado ainda.
              </p>
            ) : (
              <div className="space-y-24">
                {servicos.map((servico, index) => (
                  <div 
                    key={servico.id}
                    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                  >
                    {/* Image */}
                    <div className="flex-1 w-full">
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                        {servico.imagem_url ? (
                          <img 
                            src={servico.imagem_url} 
                            alt={servico.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <Building2 size={64} className="text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-6 left-6">
                          <div className="w-14 h-14 rounded-xl bg-primary/90 flex items-center justify-center">
                            <Building2 className="text-primary-foreground" size={28} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                        {servico.titulo}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {servico.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Servicos;
