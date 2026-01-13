import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PortfolioCategoria {
  id: string;
  nome: string;
  created_at?: string;
}

export const usePortfolioCategorias = () => {
  const [categorias, setCategorias] = useState<PortfolioCategoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const { data } = await supabase
      .from('portfolio_categorias')
      .select('*')
      .order('nome', { ascending: true });

    if (data) {
      setCategorias(data);
    }
    setLoading(false);
  };

  return { categorias, loading, refetch: fetchCategorias };
};
