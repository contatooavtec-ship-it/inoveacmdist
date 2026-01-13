import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Configuracoes {
  id?: string;
  valor_m2: number;
  valor_minimo: number;
  valor_instalacao: number;
  valor_letreiro: number;
  logo_url: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  endereco: string | null;
  telefone: string | null;
}

const defaultConfig: Configuracoes = {
  valor_m2: 350,
  valor_minimo: 1500,
  valor_instalacao: 800,
  valor_letreiro: 1200,
  logo_url: null,
  whatsapp: null,
  email: null,
  instagram: null,
  endereco: null,
  telefone: null,
};

export const useConfiguracoes = () => {
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const fetchConfiguracoes = async () => {
    const { data } = await supabase
      .from('configuracoes')
      .select('*')
      .maybeSingle();

    if (data) {
      setConfiguracoes({
        id: data.id,
        valor_m2: data.valor_m2 || defaultConfig.valor_m2,
        valor_minimo: data.valor_minimo || defaultConfig.valor_minimo,
        valor_instalacao: data.valor_instalacao || defaultConfig.valor_instalacao,
        valor_letreiro: data.valor_letreiro || defaultConfig.valor_letreiro,
        logo_url: data.logo_url,
        whatsapp: data.whatsapp,
        email: data.email,
        instagram: data.instagram,
        endereco: data.endereco,
        telefone: data.telefone,
      });
    }
    setLoading(false);
  };

  return { configuracoes, loading, refetch: fetchConfiguracoes };
};
