# INOVEACM - Sistema de Gestão

Sistema web completo para a INOVEACM, empresa especializada em fachadas ACM e comunicação visual.

## Tecnologias

- React 18 + TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (Auth, Database, Storage)
- React Router
- Recharts

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais do Supabase

# Iniciar servidor de desenvolvimento
npm run dev
```

## Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes React
├── hooks/          # Custom hooks
├── lib/            # Serviços e utilitários
├── pages/          # Páginas da aplicação
└── integrations/   # Configurações Supabase
```

## Funcionalidades

- **Site público**: Home, serviços, portfólio, orçamento, contato
- **Calculadora de orçamentos**: Cálculo automático com envio via WhatsApp
- **Painel administrativo**: Gestão de serviços, portfólio, configurações e analytics
- **Autenticação**: Login seguro com verificação de roles

## Deploy

O projeto pode ser hospedado em qualquer plataforma que suporte aplicações React/Vite.
