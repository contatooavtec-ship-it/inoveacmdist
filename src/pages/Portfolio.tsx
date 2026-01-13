import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Play, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioItem {
  id: string;
  titulo: string;
  descricao: string;
  midia_url: string | null;
  tipo: 'imagem' | 'video';
  categoria_id: string | null;
  categoria?: { nome: string } | null;
}

interface Categoria {
  id: string;
  nome: string;
}

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [filter, setFilter] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch categorias
    const { data: categoriasData } = await supabase
      .from('portfolio_categorias')
      .select('*')
      .order('nome', { ascending: true });

    if (categoriasData) {
      setCategorias(categoriasData);
    }

    // Fetch portfolio items with categoria
    const { data: portfolioData } = await supabase
      .from('portfolio')
      .select(`
        *,
        categoria:portfolio_categorias(nome)
      `)
      .order('created_at', { ascending: false });

    if (portfolioData) {
      setPortfolio(portfolioData);
    }
    setLoading(false);
  };

  const types = ["Todos", ...categorias.map(c => c.nome)];
  
  const filteredItems = filter === "Todos" 
    ? portfolio 
    : portfolio.filter(item => item.categoria?.nome === filter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-dark" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Nossos trabalhos
              </span>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mt-4 mb-6">
                <span className="text-gradient-gold">Portfólio</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Conheça alguns dos projetos que transformaram a imagem 
                de empresas em todo o Brasil.
              </p>
            </div>
          </div>
        </section>

        {/* Filter */}
        {types.length > 1 && (
          <section className="py-8 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-4">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      filter === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Portfolio Grid */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-16">
                Nenhum item no portfólio ainda.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group cursor-pointer rounded-2xl overflow-hidden bg-background border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-gold"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {item.midia_url ? (
                        item.tipo === 'video' ? (
                          <video 
                            src={item.midia_url}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img 
                            src={item.midia_url} 
                            alt={item.titulo}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <ImageIcon size={48} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {item.tipo === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                            <Play className="text-primary-foreground ml-1" size={28} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {item.categoria?.nome && (
                        <span className="text-primary text-sm font-medium">{item.categoria.nome}</span>
                      )}
                      <h3 className="text-xl font-heading font-semibold mt-2 group-hover:text-primary transition-colors">
                        {item.titulo}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Modal */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">{selectedItem?.titulo}</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden">
                  {selectedItem.tipo === 'video' && selectedItem.midia_url ? (
                    <video 
                      src={selectedItem.midia_url} 
                      controls
                      className="w-full aspect-video object-cover"
                    />
                  ) : selectedItem.midia_url ? (
                    <img 
                      src={selectedItem.midia_url} 
                      alt={selectedItem.titulo}
                      className="w-full aspect-video object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  {selectedItem.categoria?.nome && (
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                      {selectedItem.categoria.nome}
                    </span>
                  )}
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {selectedItem.descricao}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
