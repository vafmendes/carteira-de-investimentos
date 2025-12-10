# Investment Wallet Platform

> Aplicação demo para gerenciar contas e investimentos — Next.js + Supabase + Pluggy (integração demo).

Resumo
-------
Este projeto é uma interface financeira pessoal que exibe saldos, contas bancárias e investimentos. Ele foi construído como um exemplo prático usando Next.js (App Router), TypeScript, Tailwind CSS e Supabase para autenticação e persistência. Também inclui integração com a API Pluggy para importar identidades/bancos (fluxo demo).

Principais tecnologias
---------------------
- Next.js (App Router) + TypeScript
- Tailwind CSS para estilos
- Supabase (Auth, PostgREST) para backend/DB
- Pluggy (integração de contas bancárias, demo)
- Radix UI / Lucide / componentes customizados

Estrutura do projeto (resumo)
----------------------------
- `app/` — rotas e pages (App Router)
  - `app/auth/` — páginas de login / signup
  - `app/dashboard/` — páginas do painel (contas, investimentos, perfil)
- `components/` — componentes React reutilizáveis (UI e dashboard)
- `lib/` — clientes e utilitários (Supabase, Pluggy, demo-data)
- `hooks/` — hooks React compartilhados
- `public/` — assets públicos (ícones, imagens)
- `scripts/` — scripts SQL para criar tabelas/exemplos
- `styles/` — CSS global / Tailwind

Variáveis de ambiente (obrigatórias)
-----------------------------------
Adicione estas variáveis no seu ambiente local (`.env.local`) e no provedor de deploy (ex.: Vercel). NUNCA comite chaves privadas em repositórios públicos.

- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — chave publishable (cliente)
- `SUPABASE_SERVICE_ROLE_KEY` — chave service_role (server-only) — necessária para operações administrativas (inserir `profiles` bypassando RLS)
- `PLUGGY_CLIENT_ID` — (opcional, quando usar Pluggy real)
- `PLUGGY_CLIENT_SECRET` — (opcional)

Como executar localmente
------------------------
1. Instale dependências (recomendo `pnpm` ou `npm`):

```powershell
pnpm install
# ou
npm install
```

2. Crie `.env.local` com as variáveis acima.

3. Rode em modo de desenvolvimento:

```powershell
npm run dev
```

4. Acesse `http://localhost:3000`.

Deploy
------
Recomendo usar o Vercel (detecta Next.js automaticamente):

- Conecte o repositório no Vercel e adicione as variáveis de ambiente listadas acima no painel do projeto.
- Garanta que `SUPABASE_SERVICE_ROLE_KEY` esteja configurada apenas como variável de ambiente server-side (não como `NEXT_PUBLIC_`).
- Push na branch configurada irá disparar deploys automáticos.

Notas importantes
-----------------
- O `SUPABASE_SERVICE_ROLE_KEY` dá privilégios amplos: mantenha-a segura e disponível apenas em ambiente server (Vercel environment variables).
- A tabela `profiles` está protegida por RLS — operações de administração (import de Pluggy) usam a service role key via endpoints server.
- Arquivos principais para checar ao trabalhar no projeto:
  - `components/dashboard/accounts-list.tsx` (formulário de adicionar conta)
  - `app/api/pluggy/*` (rotas para integração/import)
  - `lib/supabase/*` (clientes e helpers)

Contribuição
------------
Pull requests são bem-vindos. Antes de abrir PR, rode lint e verifique builds:

```powershell
npm run lint
npm run build
```
