/**
 * Serviços centralizados de acesso ao banco de dados
 * Todas as queries CRUD devem passar por aqui
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================
// TIPOS
// ============================================

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

export interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string | null;
}

export interface PortfolioItem {
  id: string;
  titulo: string;
  descricao: string;
  midia_url: string;
  tipo: 'imagem' | 'video';
  categoria_id: string | null;
  created_at?: string;
}

export interface PortfolioCategoria {
  id: string;
  nome: string;
  created_at?: string;
}

export interface AnalyticsEvent {
  tipo: 'page_view' | 'orcamento' | 'whatsapp' | 'instagram';
  pagina: string;
  ip_hash: string;
  user_agent: string;
  referrer: string | null;
}

// ============================================
// CONFIGURAÇÕES
// ============================================

export const configuracoesService = {
  async get(): Promise<Configuracoes | null> {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar configurações:', error);
      return null;
    }
    return data;
  },

  async update(config: Partial<Configuracoes>): Promise<boolean> {
    const { error } = await supabase
      .from('configuracoes')
      .update(config)
      .eq('id', config.id);
    
    if (error) {
      console.error('Erro ao atualizar configurações:', error);
      return false;
    }
    return true;
  },

  async upsert(config: Configuracoes): Promise<boolean> {
    const { error } = await supabase
      .from('configuracoes')
      .upsert(config);
    
    if (error) {
      console.error('Erro ao salvar configurações:', error);
      return false;
    }
    return true;
  }
};

// ============================================
// SERVIÇOS
// ============================================

export const servicosService = {
  async getAll(): Promise<Servico[]> {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .order('titulo', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar serviços:', error);
      return [];
    }
    return data || [];
  },

  async create(servico: Omit<Servico, 'id'>): Promise<Servico | null> {
    const { data, error } = await supabase
      .from('servicos')
      .insert(servico)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar serviço:', error);
      return null;
    }
    return data;
  },

  async update(id: string, servico: Partial<Servico>): Promise<boolean> {
    const { error } = await supabase
      .from('servicos')
      .update(servico)
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao atualizar serviço:', error);
      return false;
    }
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('servicos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar serviço:', error);
      return false;
    }
    return true;
  }
};

// ============================================
// PORTFOLIO
// ============================================

export const portfolioService = {
  async getAll(): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar portfolio:', error);
      return [];
    }
    return data || [];
  },

  async create(item: Omit<PortfolioItem, 'id' | 'created_at'>): Promise<PortfolioItem | null> {
    const { data, error } = await supabase
      .from('portfolio')
      .insert(item)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar item do portfolio:', error);
      return null;
    }
    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar item do portfolio:', error);
      return false;
    }
    return true;
  }
};

// ============================================
// CATEGORIAS DO PORTFOLIO
// ============================================

export const categoriasService = {
  async getAll(): Promise<PortfolioCategoria[]> {
    const { data, error } = await supabase
      .from('portfolio_categorias')
      .select('*')
      .order('nome', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
    return data || [];
  },

  async create(nome: string): Promise<PortfolioCategoria | null> {
    const { data, error } = await supabase
      .from('portfolio_categorias')
      .insert({ nome })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar categoria:', error);
      return null;
    }
    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('portfolio_categorias')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar categoria:', error);
      return false;
    }
    return true;
  }
};

// ============================================
// ANALYTICS
// ============================================

export const analyticsService = {
  async track(event: AnalyticsEvent): Promise<boolean> {
    const { error } = await supabase
      .from('analytics')
      .insert(event);
    
    if (error) {
      console.error('Erro ao registrar analytics:', error);
      return false;
    }
    return true;
  },

  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);
    
    if (error) {
      console.error('Erro ao buscar analytics:', error);
      return [];
    }
    return data || [];
  }
};

// ============================================
// AUTENTICAÇÃO (helpers)
// ============================================

export const authService = {
  async checkAdminRole(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao verificar role:', error);
      return false;
    }
    return !!data;
  },

  async getCurrentSession() {
    return await supabase.auth.getSession();
  },

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  async updatePassword(newPassword: string) {
    return await supabase.auth.updateUser({ password: newPassword });
  },

  async updateEmail(newEmail: string) {
    return await supabase.auth.updateUser({ email: newEmail });
  }
};
