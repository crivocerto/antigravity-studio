# Admin Dashboard & Bot Fix Proposal

## Context
1. O bot extraiu ofertas erradas para a categoria "Maquiagem" porque a URL alvo apontava para a página geral de ofertas do Mercado Livre, não para uma sub-categoria específica.
2. A falta de interface administrativa (Dashboard) para o dono do projeto causa dependência direta no banco de dados (Supabase) para correções (como excluir a chave de impacto da seção de maquiagem).

## Scope
- **Correção do Caçador (Bot)**: Substituir a URL genérica da categoria "Maquiagem" para a URL restrita de ofertas de maquiagem e cuidados pessoais (`https://lista.mercadolivre.com.br/beleza-cuidado-pessoal/maquiagem/_Deal_ofertas-do-dia`).
- **Data Cleanup**: Excluir do banco Supabase as ofertas extraídas acidentalmente sob a tag "maquiagem".
- **Área Administrativa (`/admin`)**:
  - Rota protegida por `ADMIN_PASSWORD` no Next.js Server Components.
  - CRUD Visual: Tabela iterando sobre `deals` com foto, título, preço, e categoria.
  - Ações rápidas: Botões de excluir e editar para cada deal.
  - Injeção Manual: Formulário para adicionar URLs avulsas com categoria específica (cai no banco imediatamente).
  - Dashboard Analítico: Ranking do Top 5 ofertas mais clicadas (baseado nos registros da tabela `cliques` preenchida pelo `/v1/go`).

## Risks & Considerations
- A contagem de cliques vai exigir que a UI execute um `.select('id', { count: 'exact' })` no Supabase filtrado por produto, ou crie uma Stored Procedure (RPC) no banco para juntar deals e contagem de cliques em uma única query otimizada.
- O formulário de adição manual precisará passar pelo processo de encurtamento de links (Afiliado), mas como a Edge Function não possui acesso ao Playwright para bypassar a restrição de DOM, o link manual deverá já vir como link curto do usuário, ou ele precisará ter um gerador. Pelo escopo "você cola o link dele lá", vamos assumir que o usuário insere a URL já convertida (Meli.la) para facilitar.
