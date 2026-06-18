# Global State & Architecture Overview

## Project: Antigravity Studio (Vitrine Ofertas)

### 1. Overview
Uma vitrine de ofertas otimizada para conversão de alto tráfego (Growth Hacking/TikTok) gerada estaticamente com Next.js, conectada a um backend Supabase para persistência de dados. O projeto inclui um bot de raspagem em Node.js (`cacador.ts`) usando Playwright para extrair produtos automaticamente (atualmente focado no Mercado Livre).

### 2. Architecture
- **Frontend**: Next.js (App Router, SSG via `output: export`), React, Tailwind CSS.
- **Backend/DB**: Supabase (PostgreSQL com RLS ativado). Edge Functions do Supabase para redirecionamento e injeção de dados.
- **Bot**: Node.js, TypeScript, Playwright (com Stealth plugin `puppeteer-extra-plugin-stealth`).
- **Deploy**: Vercel (Frontend) / Supabase (Backend) / Local/Docker (Bot).

### 3. Key Components
- `ProductGrid` & `ProductCard`: Componentes de exibição de alta conversão.
- `cacador.ts`: Motor autônomo de raspagem.
- Supabase Edge Functions (`v1/products`, `v1/go`): Endpoints serverless para injeção de dados via API e redirecionamento de links profundos.
