# Research: Admin Dashboard Full Overhaul & Legacy Migration

## 1. Contexto Atual do Projeto
- O projeto "CrivoCerto v3" acaba de migrar de um blog tradicional (tabela `posts`) para um portal de **Programmatic SEO** focado em afiliados (tabelas `products`, `guides`, `guide_products`, `guide_views`, e `clicks_tracking`).
- A tela inicial do Admin (`index.tsx`) já possui o esqueleto visual correto (Apple Liquid Glass, Bento Grid), e já lê dados globais reais via RPC `get_admin_dashboard_metrics`, **porém** o gráfico principal ainda usa dados *mockados* (`CTR_DATA`) para a timeline de 7 dias, desapontando a expectativa de dados reais.
- A tela de gerenciamento (`posts.tsx`) está completamente defasada. Ela ainda aponta para a tabela legada `posts`. Isso faz com que os reviews gerados pela IA na nova arquitetura (guias e produtos) não apareçam na lista.
- A tela de API (`api.tsx`) tem boa estrutura, mas o prompt gerado precisa ser atualizado para refletir o novo payload que a Edge Function `hermes-gateway` aceita (usando `upsert_product`, `insert_guide`, etc., ao invés de `insert_post`).

## 2. Benchmarking Competitivo (UX/UI & Analytics)
Para projetar o painel definitivo do CrivoCerto v3, olhamos para as maiores referências do mercado:

### A. Ferramentas de Afiliados (Voluum / Post Affiliate Pro)
- **O que fazem bem:** Dashboard focado em EPC (Earnings Per Click) e funil de conversão. O gráfico principal é dividido sempre entre Page Views x Clicks x Conversões. 
- **Lição:** O nosso gráfico de 7 dias precisa bater diretamente na tabela `guide_views` agrupada por dia e cruzar com `clicks_tracking` agrupada por dia, plotando as 3 linhas (Amazon, ML, Shopee) com base em dados reais gerados pela IA.

### B. Headless CMS (Sanity / Strapi)
- **O que fazem bem:** Gerenciamento relacional de conteúdo.
- **Lição:** A tela de `posts.tsx` deve se transformar numa central `guides_and_products.tsx`, onde vemos os "Guias" (ex: Os 3 Melhores Fones) e dentro de cada guia, a IA rankeou os produtos. A interface precisa mostrar o status do guia, quantos produtos estão linkados, e a última vez que o Hermes revalidou os preços.

## 3. Conclusão da Pesquisa
O foco absoluto da reconstrução não é apenas "embelezar" as telas restantes, mas sim **conectar o cérebro (Supabase + Programmatic SEO) aos músculos (React UI)** de forma holística. Nenhuma tela do Admin pode continuar apontando para arquiteturas antigas. Tudo precisa beber dos RPCs e das tabelas novas criadas na Spec 011.
