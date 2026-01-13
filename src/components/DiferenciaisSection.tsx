import { Ruler, Shield, Wrench, Sparkles } from "lucide-react";

const features = [
  {
    icon: Ruler,
    title: "Engenharia e Precisão",
    description: "Projetos desenvolvidos com cálculos estruturais precisos e engenharia de alto nível.",
  },
  {
    icon: Shield,
    title: "Materiais Premium",
    description: "Utilizamos apenas ACM de primeira linha com garantia de durabilidade e qualidade.",
  },
  {
    icon: Wrench,
    title: "Instalação Profissional",
    description: "Equipe técnica com anos de experiência em instalações complexas.",
  },
  {
    icon: Sparkles,
    title: "Projetos Sob Medida",
    description: "Cada projeto é único e desenvolvido especificamente para sua empresa.",
  },
];

const DiferenciaisSection = () => {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Por que escolher a INOVEACM
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            Nossos <span className="text-gradient-gold">Diferenciais</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Combinamos tecnologia, experiência e compromisso para entregar 
            resultados que superam expectativas.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-gold"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiferenciaisSection;
