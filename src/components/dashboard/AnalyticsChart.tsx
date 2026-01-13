import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  date: string;
  pageViews: number;
  orcamentos: number;
  whatsapp: number;
  email: number;
  instagram: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
  title: string;
}

export const AnalyticsChart = ({ data, title }: AnalyticsChartProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-xl font-heading font-bold mb-6">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOrcamentos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWhatsapp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '12px',
                color: '#fff',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="pageViews"
              name="Visitas"
              stroke="#60a5fa"
              fillOpacity={1}
              fill="url(#colorPageViews)"
            />
            <Area
              type="monotone"
              dataKey="orcamentos"
              name="Orçamentos"
              stroke="#4ade80"
              fillOpacity={1}
              fill="url(#colorOrcamentos)"
            />
            <Area
              type="monotone"
              dataKey="whatsapp"
              name="WhatsApp"
              stroke="#34d399"
              fillOpacity={1}
              fill="url(#colorWhatsapp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
