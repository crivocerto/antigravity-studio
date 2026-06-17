# Proposal: Full Admin Overhaul & Data Integration

## Resumo
O objetivo desta funcionalidade é reconstruir e integrar **todas** as páginas do painel administrativo (Dashboard, Gerenciamento de Conteúdo e Integração API) para a nova arquitetura baseada em Programmatic SEO, descartando totalmente dados mockados e tabelas antigas. Adicionalmente, simularemos métricas reais de visualizações e cliques para que o usuário possa validar a performance nativa do sistema em produção.

## User Stories
1. **Como Administrador**, quero que o gráfico principal da Visão Geral (Dashboard) mostre o histórico real dos últimos 7 dias baseado em cliques (Amazon, Mercado Livre, Shopee) cruzados com visualizações, para tomar decisões embasadas.
2. **Como Administrador**, quero ver a lista de "Guias" (Guides) e seus respectivos produtos na tela de "Gerenciamento de Conteúdo", para substituir a visão antiquada de `posts` individuais.
3. **Como Administrador**, quero ver as métricas de performance (CTR, Receita e Split) preenchidas com dados autênticos gerados pelo fluxo do usuário final e agentes.

## Critérios de Aceite
- Nenhum dado fixo (mock) no gráfico do `index.tsx`. Ele deve carregar do banco de dados (novo RPC ou fetch agrupado).
- A aba "Gerenciar Reviews" (`posts.tsx`) deve ser refatorada para ler da tabela `guides` e exibir expansões (accordion) ou badges informando quais `products` estão linkados a ele.
- O prompt da página de API deve refletir o formato JSON correto exigido pelo novo `hermes-gateway` (ex: usar a action `upsert_product` ao invés de `insert_post`).
- Um script de geração de tráfego (`simulate_traffic.cjs`) deve ser criado e executado para popular `guide_views` e `clicks_tracking` de forma randômica nos últimos 7 dias.

## BDD Scenarios

### Cenário: Visualização de Gráfico Real de 7 Dias
- **Dado** que existem registros retroativos de 7 dias nas tabelas `clicks_tracking` e `guide_views`
- **Quando** o Administrador entra na tela inicial do Painel (`/admin`)
- **Então** o gráfico Recharts exibe as linhas dinâmicas exatas correspondentes ao volume diário de banco de dados, descartando qualquer array hardcoded.

### Cenário: Listagem da Nova Arquitetura Programática
- **Dado** que o agente Hermes publicou um guia com 3 produtos via Gateway
- **Quando** o Administrador navega para a tela de "Gerenciar Reviews"
- **Então** ele não vê mais a estrutura antiga de posts, e sim o Guia recém-publicado com o status "PUBLICADO" e uma contagem de "3 Produtos Rankeados".
