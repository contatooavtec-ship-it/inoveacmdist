import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ImageIcon, 
  FolderOpen, 
  LogOut, 
  DollarSign,
  Plus,
  Trash2,
  Edit,
  Save,
  User,
  BarChart3,
  Calendar,
  Instagram
} from "lucide-react";
import { useFileUpload, getFileType } from "@/hooks/useFileUpload";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { SmartReport } from "@/components/dashboard/SmartReport";

interface Configuracoes {
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

interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string | null;
}

interface PortfolioItem {
  id: string;
  titulo: string;
  descricao: string;
  midia_url: string | null;
  tipo: 'imagem' | 'video';
  categoria_id: string | null;
}

interface PortfolioCategoria {
  id: string;
  nome: string;
}

interface AnalyticsStats {
  pageViews: number;
  orcamentos: number;
  whatsapp: number;
  instagram: number;
}

interface ChartData {
  date: string;
  pageViews: number;
  orcamentos: number;
  whatsapp: number;
  instagram: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({
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
  });
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [categorias, setCategorias] = useState<PortfolioCategoria[]>([]);
  const [newCategoria, setNewCategoria] = useState('');
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [newServico, setNewServico] = useState<{ titulo: string; descricao: string; file: File | null }>({ titulo: '', descricao: '', file: null });
  const [newPortfolio, setNewPortfolio] = useState<{ titulo: string; descricao: string; file: File | null; tipo: 'imagem' | 'video'; categoria_id: string }>({ titulo: '', descricao: '', file: null, tipo: 'imagem', categoria_id: '' });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [editingServicoFile, setEditingServicoFile] = useState<File | null>(null);

  const logoUpload = useFileUpload();
  const servicoUpload = useFileUpload();
  const portfolioUpload = useFileUpload();
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsStats>({ pageViews: 0, orcamentos: 0, whatsapp: 0, instagram: 0 });
  const [previousAnalytics, setPreviousAnalytics] = useState<AnalyticsStats>({ pageViews: 0, orcamentos: 0, whatsapp: 0, instagram: 0 });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [demoBypassActive, setDemoBypassActive] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && !demoBypassActive) {
      fetchAnalytics();
    }
  }, [dateRange, isLoading, demoBypassActive]);

  const checkAuth = async () => {
    const canBypass = typeof window !== 'undefined' && window.localStorage.getItem('demoBypass') === '1';
    if (canBypass) {
      window.localStorage.removeItem('demoBypass');
      setDemoBypassActive(true);
      await fetchData();
      setIsLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
      return;
    }

    // Verificar se é admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão de administrador.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      navigate('/admin');
      return;
    }

    await fetchData();
    setIsLoading(false);
  };

  const fetchData = async () => {
    // Fetch configuracoes
    const { data: configData } = await supabase
      .from('configuracoes')
      .select('*')
      .maybeSingle();
    
    if (configData) {
      setConfiguracoes({
        id: configData.id,
        valor_m2: configData.valor_m2 || 350,
        valor_minimo: configData.valor_minimo || 1500,
        valor_instalacao: configData.valor_instalacao || 800,
        valor_letreiro: configData.valor_letreiro || 1200,
        logo_url: configData.logo_url,
        whatsapp: configData.whatsapp,
        email: configData.email,
        instagram: configData.instagram,
        endereco: configData.endereco,
        telefone: configData.telefone,
      });
    }

    // Fetch servicos
    const { data: servicosData } = await supabase
      .from('servicos')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (servicosData) {
      setServicos(servicosData);
    }

    // Fetch portfolio
    const { data: portfolioData } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (portfolioData) {
      setPortfolio(portfolioData);
    }

    // Fetch categorias
    const { data: categoriasData } = await supabase
      .from('portfolio_categorias')
      .select('*')
      .order('nome', { ascending: true });
    
    if (categoriasData) {
      setCategorias(categoriasData);
    }
  };

  const fetchAnalytics = async () => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    // Current period
    const { data: currentData } = await supabase
      .from('analytics')
      .select('tipo, created_at')
      .gte('created_at', startDate.toISOString());

    // Previous period
    const { data: previousData } = await supabase
      .from('analytics')
      .select('tipo')
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', startDate.toISOString());

    if (currentData) {
      const stats: AnalyticsStats = { pageViews: 0, orcamentos: 0, whatsapp: 0, instagram: 0 };
      currentData.forEach((item: any) => {
        switch (item.tipo) {
          case 'page_view': stats.pageViews++; break;
          case 'orcamento': stats.orcamentos++; break;
          case 'whatsapp': stats.whatsapp++; break;
          case 'instagram': stats.instagram++; break;
        }
      });
      setAnalytics(stats);

      // Process chart data
      const chartMap = new Map<string, ChartData>();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        chartMap.set(dateKey, { date: dateKey, pageViews: 0, orcamentos: 0, whatsapp: 0, instagram: 0 });
      }

      currentData.forEach((item: any) => {
        const itemDate = new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const existing = chartMap.get(itemDate);
        if (existing) {
          switch (item.tipo) {
            case 'page_view': existing.pageViews++; break;
            case 'orcamento': existing.orcamentos++; break;
            case 'whatsapp': existing.whatsapp++; break;
            case 'instagram': existing.instagram++; break;
          }
        }
      });

      setChartData(Array.from(chartMap.values()));
    }

    if (previousData) {
      const prevStats: AnalyticsStats = { pageViews: 0, orcamentos: 0, whatsapp: 0, instagram: 0 };
      previousData.forEach((item: any) => {
        switch (item.tipo) {
          case 'page_view': prevStats.pageViews++; break;
          case 'orcamento': prevStats.orcamentos++; break;
          case 'whatsapp': prevStats.whatsapp++; break;
          case 'instagram': prevStats.instagram++; break;
        }
      });
      setPreviousAnalytics(prevStats);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const saveConfiguracoes = async () => {
    let logoUrl = configuracoes.logo_url;

    // Upload do logo se houver novo arquivo
    if (logoFile) {
      const result = await logoUpload.uploadFile(logoFile, 'logos');
      if (result) {
        logoUrl = result.url;
        setLogoFile(null);
      } else {
        toast({ title: "Erro no upload", description: logoUpload.error || "Falha ao enviar logo", variant: "destructive" });
        return;
      }
    }

    const { error } = await supabase
      .from('configuracoes')
      .upsert({
        id: configuracoes.id || undefined,
        valor_m2: configuracoes.valor_m2,
        valor_minimo: configuracoes.valor_minimo,
        valor_instalacao: configuracoes.valor_instalacao,
        valor_letreiro: configuracoes.valor_letreiro,
        logo_url: logoUrl,
        whatsapp: configuracoes.whatsapp,
        email: configuracoes.email,
        instagram: configuracoes.instagram,
        endereco: configuracoes.endereco,
        telefone: configuracoes.telefone,
      });

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Salvo!", description: "Configurações atualizadas com sucesso." });
      fetchData();
    }
  };

  const addServico = async () => {
    if (!newServico.titulo) return;

    let imagemUrl: string | null = null;

    // Upload da imagem se houver arquivo
    if (newServico.file) {
      const result = await servicoUpload.uploadFile(newServico.file, 'servicos');
      if (result) {
        imagemUrl = result.url;
      } else {
        toast({ title: "Erro no upload", description: servicoUpload.error || "Falha ao enviar imagem", variant: "destructive" });
        return;
      }
    }

    const { error } = await supabase
      .from('servicos')
      .insert({
        titulo: newServico.titulo,
        descricao: newServico.descricao,
        imagem_url: imagemUrl,
      });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Serviço adicionado!" });
      setNewServico({ titulo: '', descricao: '', file: null });
      fetchData();
    }
  };

  const updateServico = async () => {
    if (!editingServico) return;

    let imagemUrl = editingServico.imagem_url;

    // Upload da nova imagem se houver arquivo
    if (editingServicoFile) {
      const result = await servicoUpload.uploadFile(editingServicoFile, 'servicos');
      if (result) {
        imagemUrl = result.url;
        setEditingServicoFile(null);
      } else {
        toast({ title: "Erro no upload", description: servicoUpload.error || "Falha ao enviar imagem", variant: "destructive" });
        return;
      }
    }

    const { error } = await supabase
      .from('servicos')
      .update({
        titulo: editingServico.titulo,
        descricao: editingServico.descricao,
        imagem_url: imagemUrl,
      })
      .eq('id', editingServico.id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Serviço atualizado!" });
      setEditingServico(null);
      fetchData();
    }
  };

  const deleteServico = async (id: string) => {
    const { error } = await supabase
      .from('servicos')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Serviço removido!" });
      fetchData();
    }
  };

  const addPortfolio = async () => {
    if (!newPortfolio.titulo) return;

    let midiaUrl: string | null = null;
    let tipo = newPortfolio.tipo;

    // Upload da mídia se houver arquivo
    if (newPortfolio.file) {
      tipo = getFileType(newPortfolio.file);
      const result = await portfolioUpload.uploadFile(newPortfolio.file, 'portfolio');
      if (result) {
        midiaUrl = result.url;
      } else {
        toast({ title: "Erro no upload", description: portfolioUpload.error || "Falha ao enviar mídia", variant: "destructive" });
        return;
      }
    }

    const { error } = await supabase
      .from('portfolio')
      .insert({
        titulo: newPortfolio.titulo,
        descricao: newPortfolio.descricao,
        midia_url: midiaUrl,
        tipo: tipo,
        categoria_id: newPortfolio.categoria_id || null,
      });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Item adicionado ao portfólio!" });
      setNewPortfolio({ titulo: '', descricao: '', file: null, tipo: 'imagem', categoria_id: '' });
      fetchData();
    }
  };

  const deletePortfolio = async (id: string) => {
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Item removido!" });
      fetchData();
    }
  };

  const addCategoria = async () => {
    if (!newCategoria.trim()) return;

    const { error } = await supabase
      .from('portfolio_categorias')
      .insert({ nome: newCategoria.trim() });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Categoria adicionada!" });
      setNewCategoria('');
      fetchData();
    }
  };

  const deleteCategoria = async (id: string) => {
    const { error } = await supabase
      .from('portfolio_categorias')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Categoria removida!" });
      fetchData();
    }
  };

  const updatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Erro", description: "Senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Senha atualizada!" });
      setNewPassword('');
    }
  };

  const updateEmail = async () => {
    if (!newEmail) return;

    const { error } = await supabase.auth.updateUser({ email: newEmail });
    
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email atualizado!", description: "Verifique seu novo email." });
      setNewEmail('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold">
            <span className="text-foreground">INOVE</span>
            <span className="text-gradient-gold">ACM</span>
            <span className="text-muted-foreground ml-2 font-normal text-sm">Admin</span>
          </h1>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut size={18} className="mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analytics" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-card border border-border">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 size={18} className="mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="valores" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <DollarSign size={18} className="mr-2" />
              Valores
            </TabsTrigger>
            <TabsTrigger value="servicos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FolderOpen size={18} className="mr-2" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ImageIcon size={18} className="mr-2" />
              Portfólio
            </TabsTrigger>
            <TabsTrigger value="conta" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User size={18} className="mr-2" />
              Conta
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold">Dashboard de Analytics</h2>
              <Select value={dateRange} onValueChange={(v) => setDateRange(v as '7d' | '30d' | '90d')}>
                <SelectTrigger className="w-40 bg-card border-border">
                  <Calendar size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <AnalyticsCards stats={analytics} previousStats={previousAnalytics} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsChart data={chartData} title="Evolução de Métricas" />
              <SmartReport stats={analytics} previousStats={previousAnalytics} />
            </div>
          </TabsContent>

          {/* Valores Tab */}
          <TabsContent value="valores" className="space-y-6">
            {/* Valores de Orçamento */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Configurações de Valores</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-foreground mb-2 block">Valor por m² (R$)</Label>
                  <Input
                    type="number"
                    value={configuracoes.valor_m2}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, valor_m2: parseFloat(e.target.value) })}
                    className="bg-secondary border-border text-foreground h-12"
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-2 block">Valor Mínimo (R$)</Label>
                  <Input
                    type="number"
                    value={configuracoes.valor_minimo}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, valor_minimo: parseFloat(e.target.value) })}
                    className="bg-secondary border-border text-foreground h-12"
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-2 block">Valor Instalação (R$)</Label>
                  <Input
                    type="number"
                    value={configuracoes.valor_instalacao}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, valor_instalacao: parseFloat(e.target.value) })}
                    className="bg-secondary border-border text-foreground h-12"
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-2 block">Valor Letreiro (R$)</Label>
                  <Input
                    type="number"
                    value={configuracoes.valor_letreiro}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, valor_letreiro: parseFloat(e.target.value) })}
                    className="bg-secondary border-border text-foreground h-12"
                  />
                </div>
              </div>

              <Button 
                onClick={saveConfiguracoes}
                className="bg-gradient-gold text-primary-foreground font-semibold mt-6"
              >
                <Save size={18} className="mr-2" />
                Salvar Valores
              </Button>
            </div>
          </TabsContent>

          {/* Serviços Tab */}
          <TabsContent value="servicos" className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading font-bold">Gerenciar Serviços</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-gold text-primary-foreground">
                      <Plus size={18} className="mr-2" />
                      Novo Serviço
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Adicionar Serviço</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Título</Label>
                        <Input
                          value={newServico.titulo}
                          onChange={(e) => setNewServico({ ...newServico, titulo: e.target.value })}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Descrição</Label>
                        <Textarea
                          value={newServico.descricao}
                          onChange={(e) => setNewServico({ ...newServico, descricao: e.target.value })}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Imagem do Serviço</Label>
                        <FileUpload
                          onFileSelect={(file) => setNewServico({ ...newServico, file })}
                          onRemove={() => setNewServico({ ...newServico, file: null })}
                          accept="image"
                          uploading={servicoUpload.uploading}
                          progress={servicoUpload.progress}
                        />
                      </div>
                      <Button onClick={addServico} className="w-full bg-gradient-gold text-primary-foreground">
                        Adicionar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {servicos.map((servico) => (
                  <div key={servico.id} className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                    {servico.imagem_url && (
                      <img src={servico.imagem_url} alt={servico.titulo} className="w-16 h-16 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{servico.titulo}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{servico.descricao}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingServico(servico)}>
                        <Edit size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteServico(servico.id)} className="text-destructive hover:text-destructive">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
                {servicos.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhum serviço cadastrado.</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading font-bold">Gerenciar Portfólio</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-gold text-primary-foreground">
                      <Plus size={18} className="mr-2" />
                      Novo Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Adicionar ao Portfólio</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Título</Label>
                        <Input
                          value={newPortfolio.titulo}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, titulo: e.target.value })}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Descrição</Label>
                        <Textarea
                          value={newPortfolio.descricao}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, descricao: e.target.value })}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Categoria</Label>
                        <Select value={newPortfolio.categoria_id} onValueChange={(v) => setNewPortfolio({ ...newPortfolio, categoria_id: v })}>
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {categorias.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="mb-2 block">Imagem ou Vídeo</Label>
                        <FileUpload
                          onFileSelect={(file) => setNewPortfolio({ ...newPortfolio, file, tipo: getFileType(file) })}
                          onRemove={() => setNewPortfolio({ ...newPortfolio, file: null })}
                          accept="both"
                          uploading={portfolioUpload.uploading}
                          progress={portfolioUpload.progress}
                        />
                      </div>
                      <Button onClick={addPortfolio} className="w-full bg-gradient-gold text-primary-foreground">
                        Adicionar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Gerenciar Categorias */}
              <div className="mb-6 p-4 bg-secondary rounded-xl">
                <h3 className="font-semibold mb-3">Categorias do Portfólio</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {categorias.map((cat) => (
                    <span key={cat.id} className="inline-flex items-center gap-1 px-3 py-1 bg-background rounded-full text-sm">
                      {cat.nome}
                      <button onClick={() => deleteCategoria(cat.id)} className="text-destructive hover:text-destructive/80 ml-1">
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCategoria}
                    onChange={(e) => setNewCategoria(e.target.value)}
                    placeholder="Nova categoria..."
                    className="bg-background border-border h-10"
                  />
                  <Button onClick={addCategoria} size="sm" className="bg-primary">
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.map((item) => (
                  <div key={item.id} className="bg-secondary rounded-xl overflow-hidden">
                    {item.midia_url && item.tipo === 'imagem' && (
                      <img src={item.midia_url} alt={item.titulo} className="w-full h-40 object-cover" />
                    )}
                    {item.midia_url && item.tipo === 'video' && (
                      <video src={item.midia_url} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold">{item.titulo}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.descricao}</p>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="icon" onClick={() => deletePortfolio(item.id)} className="text-destructive hover:text-destructive">
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {portfolio.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Nenhum item no portfólio.</p>
              )}
            </div>
          </TabsContent>

          {/* Conta Tab */}
          <TabsContent value="conta" className="space-y-6">
            {/* Logo do Site */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Logo do Site</h2>
              <FileUpload
                onFileSelect={(file) => setLogoFile(file)}
                onRemove={() => {
                  setLogoFile(null);
                  setConfiguracoes({ ...configuracoes, logo_url: null });
                }}
                currentUrl={logoFile ? undefined : configuracoes.logo_url}
                accept="image"
                uploading={logoUpload.uploading}
                progress={logoUpload.progress}
              />
            </div>

            {/* Informações de Contato */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Informações de Contato</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-foreground mb-2 block">WhatsApp</Label>
                  <Input
                    type="text"
                    value={configuracoes.whatsapp || ''}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, whatsapp: e.target.value })}
                    placeholder="5511999999999"
                    className="bg-secondary border-border text-foreground h-12"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Formato: código do país + DDD + número</p>
                </div>
                <div>
                  <Label className="text-foreground mb-2 block">Telefone</Label>
                  <Input
                    type="text"
                    value={configuracoes.telefone || ''}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="bg-secondary border-border text-foreground h-12"
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-2 block">Email</Label>
                  <Input
                    type="email"
                    value={configuracoes.email || ''}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, email: e.target.value })}
                    placeholder="contato@empresa.com"
                    className="bg-secondary border-border text-foreground h-12"
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-2 block flex items-center gap-2">
                    <Instagram size={18} className="text-primary" />
                    Instagram
                  </Label>
                  <Input
                    type="text"
                    value={configuracoes.instagram || ''}
                    onChange={(e) => {
                      // Remove @ se o usuário digitar
                      const value = e.target.value.replace(/^@/, '');
                      setConfiguracoes({ ...configuracoes, instagram: value });
                    }}
                    placeholder="seuinstagram (sem @)"
                    className="bg-secondary border-border text-foreground h-12"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Digite apenas o nome do perfil (sem @)</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-foreground mb-2 block">Endereço</Label>
                  <Input
                    type="text"
                    value={configuracoes.endereco || ''}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, endereco: e.target.value })}
                    placeholder="Cidade, Estado - País"
                    className="bg-secondary border-border text-foreground h-12"
                  />
                </div>
              </div>

              <Button 
                onClick={saveConfiguracoes}
                className="bg-gradient-gold text-primary-foreground font-semibold mt-6"
              >
                <Save size={18} className="mr-2" />
                Salvar Configurações
              </Button>
            </div>

            {/* Configurações da Conta */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Configurações da Conta</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
                  <div className="flex gap-4">
                    <Input
                      type="password"
                      placeholder="Nova senha"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-secondary border-border text-foreground h-12 flex-1"
                    />
                    <Button onClick={updatePassword} className="bg-gradient-gold text-primary-foreground">
                      Atualizar Senha
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Alterar Email</h3>
                  <div className="flex gap-4">
                    <Input
                      type="email"
                      placeholder="Novo email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="bg-secondary border-border text-foreground h-12 flex-1"
                    />
                    <Button onClick={updateEmail} className="bg-gradient-gold text-primary-foreground">
                      Atualizar Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog para editar serviço */}
        <Dialog open={!!editingServico} onOpenChange={() => setEditingServico(null)}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Editar Serviço</DialogTitle>
            </DialogHeader>
            {editingServico && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Título</Label>
                  <Input
                    value={editingServico.titulo}
                    onChange={(e) => setEditingServico({ ...editingServico, titulo: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Descrição</Label>
                  <Textarea
                    value={editingServico.descricao}
                    onChange={(e) => setEditingServico({ ...editingServico, descricao: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Imagem do Serviço</Label>
                  <FileUpload
                    onFileSelect={(file) => setEditingServicoFile(file)}
                    onRemove={() => {
                      setEditingServicoFile(null);
                      setEditingServico({ ...editingServico, imagem_url: null });
                    }}
                    currentUrl={editingServicoFile ? undefined : editingServico.imagem_url}
                    accept="image"
                    uploading={servicoUpload.uploading}
                    progress={servicoUpload.progress}
                  />
                </div>
                <Button onClick={updateServico} className="w-full bg-gradient-gold text-primary-foreground">
                  Salvar Alterações
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;
