# Global Features & Components

## 1. Frontend
- **Vitrine (Home)**: SSG page que busca dados (`deals`) do Supabase no client-side (devido ao output export da Vercel/Lovable).
- **ProductCard**: Cartão de produto focado em conversão. Responsável por construir a URL de redirecionamento para o backend (`/functions/v1/go?id=...`).
- **Deep Linking Engine**: Lógica de roteamento que garante abertura nativa de APPs mobile (ex: APP do Mercado Livre) para reduzir atrito na conversão.

## 2. Backend & DB
- **Tabela `deals`**: Armazena título, preços (original/desconto), imagem e o `affiliate_url`.
- **API `v1/products`**: Edge function protegida por `BOT_API_KEY` para receber o payload do bot e persistir no banco.
- **API `v1/go`**: Edge function que recebe um ID, resolve a URL afiliada e faz o redirecionamento 302 para o cliente final.

## 3. Bot (Caçador)
- **Modo Stealth**: Configurado com `playwright-extra` e `puppeteer-extra-plugin-stealth` para mascarar automação contra Cloudflare/Datadome.
- **Extração Dinâmica**: Utiliza seletores flexíveis (`.promotion-item`, `.poly-card`) para mapear produtos na seção de Beleza.
- **[NOVO] Injeção de Sessão (Afiliado)**: Necessidade de carregar cookies autenticados para navegar em painéis fechados (como o Gerador de Links do Mercado Livre) e converter o link raspado limpo no link final de afiliado.

## 4. Admin Dashboard
- **Painel Central (`/admin`)**: Rota protegida (Middleware validando Cookie via Server Actions e `ADMIN_PASSWORD`).
- **Módulos Internos**:
  - Tabela CRUD para gerenciamento de ofertas (exclusão, edição).
  - Injeção Manual de ofertas com URL curta já finalizada.
  - Analytics Integrado ("Top 5 Ofertas Mais Clicadas" consultando a tabela `cliques`).
