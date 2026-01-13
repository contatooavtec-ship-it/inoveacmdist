import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

interface SmartReportProps {
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

export const SmartReport = ({ stats, previousStats }: SmartReportProps) => {
  const totalContatos = stats.whatsapp + stats.instagram;
  const taxaConversao = stats.pageViews > 0 ? ((stats.orcamentos / stats.pageViews) * 100).toFixed(2) : 0;
  const canalMaisUsado =
    stats.whatsapp >= stats.instagram ? 'WhatsApp' : 'Instagram';

  const insights: { icon: React.ReactNode; text: string; type: 'success' | 'warning' | 'info' }[] = [];

  // Taxa de conversão
  if (Number(taxaConversao) >= 5) {
    insights.push({
      icon: <CheckCircle className="text-green-400" size={20} />,
      text: `Excelente taxa de conversão de ${taxaConversao}%! O site está convertendo bem visitantes em orçamentos.`,
      type: 'success',
    });
  } else if (Number(taxaConversao) >= 2) {
    insights.push({
      icon: <Lightbulb className="text-amber-400" size={20} />,
      text: `Taxa de conversão de ${taxaConversao}%. Considere otimizar o CTA e a página de orçamento.`,
      type: 'info',
    });
  } else {
    insights.push({
      icon: <AlertCircle className="text-red-400" size={20} />,
      text: `Taxa de conversão baixa (${taxaConversao}%). Revise o conteúdo e facilite o acesso ao orçamento.`,
      type: 'warning',
    });
  }

  // Canal preferido
  insights.push({
    icon: <Lightbulb className="text-primary" size={20} />,
    text: `${canalMaisUsado} é o canal de contato mais utilizado. Priorize esse canal para atendimento rápido.`,
    type: 'info',
  });

  // Comparação com período anterior
  if (previousStats) {
    const visitasGrowth = ((stats.pageViews - previousStats.pageViews) / (previousStats.pageViews || 1)) * 100;
    if (visitasGrowth > 20) {
      insights.push({
        icon: <TrendingUp className="text-green-400" size={20} />,
        text: `Crescimento de ${visitasGrowth.toFixed(0)}% nas visitas comparado ao período anterior. Continue assim!`,
        type: 'success',
      });
    } else if (visitasGrowth < -10) {
      insights.push({
        icon: <TrendingDown className="text-red-400" size={20} />,
        text: `Queda de ${Math.abs(visitasGrowth).toFixed(0)}% nas visitas. Considere investir em marketing digital.`,
        type: 'warning',
      });
    }
  }

  // Sugestões
  if (stats.instagram < stats.whatsapp * 0.3) {
    insights.push({
      icon: <Lightbulb className="text-pink-400" size={20} />,
      text: `O Instagram tem baixo engajamento. Invista em conteúdo visual e stories para atrair mais leads.`,
      type: 'info',
    });
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
        <Lightbulb className="text-primary" size={24} />
        Relatório Inteligente
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{taxaConversao}%</p>
          <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{totalContatos}</p>
          <p className="text-sm text-muted-foreground">Total de Contatos</p>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{canalMaisUsado}</p>
          <p className="text-sm text-muted-foreground">Canal Principal</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-4 rounded-xl ${
              insight.type === 'success' 
                ? 'bg-green-400/10 border border-green-400/20' 
                : insight.type === 'warning'
                  ? 'bg-red-400/10 border border-red-400/20'
                  : 'bg-primary/10 border border-primary/20'
            }`}
          >
            {insight.icon}
            <p className="text-sm text-foreground">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
