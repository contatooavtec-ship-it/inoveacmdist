import { Eye, FileText, MessageCircle, Instagram, TrendingUp } from 'lucide-react';

interface AnalyticsCardsProps {
  stats: {
    pageViews: number;
    orcamentos: number;
    whatsapp: number;
    instagram: number;
  };
  previousStats?: {
    pageViews: number;
    orcamentos: number;
    whatsapp: number;
    instagram: number;
  };
}

const calculateGrowth = (current: number, previous: number): string => {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const growth = ((current - previous) / previous) * 100;
  return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
};

export const AnalyticsCards = ({ stats, previousStats }: AnalyticsCardsProps) => {
  const cards = [
    {
      title: 'Visitas ao Site',
      value: stats.pageViews,
      icon: Eye,
      growth: previousStats ? calculateGrowth(stats.pageViews, previousStats.pageViews) : undefined,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: 'Orçamentos',
      value: stats.orcamentos,
      icon: FileText,
      growth: previousStats ? calculateGrowth(stats.orcamentos, previousStats.orcamentos) : undefined,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      title: 'WhatsApp',
      value: stats.whatsapp,
      icon: MessageCircle,
      growth: previousStats ? calculateGrowth(stats.whatsapp, previousStats.whatsapp) : undefined,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
    },
    {
      title: 'Instagram',
      value: stats.instagram,
      icon: Instagram,
      growth: previousStats ? calculateGrowth(stats.instagram, previousStats.instagram) : undefined,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
              <card.icon className={card.color} size={24} />
            </div>
            {card.growth && (
              <span className={`text-sm font-medium ${card.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {card.growth}
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-foreground">{card.value.toLocaleString('pt-BR')}</p>
          <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
        </div>
      ))}
    </div>
  );
};
