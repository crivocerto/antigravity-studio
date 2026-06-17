# Research: Admin Dashboard 100% Funcional

## O Problema Atual (Root Cause)
1. **Mock de Exclusão:** Em `src/routes/admin/posts.tsx`, o botão de excluir post (🗑️) apenas remove o post do estado local React (`setPostsList(prev => prev.filter(...))`), não efetivando nenhuma query SQL de `DELETE` no banco de dados Supabase. Ao recarregar a página, o post deletado ressurge.
2. **Mock de Geração IA:** A função `handleGenerateAI` no mesmo arquivo tentar fazer uma chamada HTTP e, em caso de falha de CORS ou endpoint ausente, injeta um mock rígido local de uma Smart TV LG.
3. **Métricas sem Contexto Profundo:** Em `src/routes/admin/index.tsx`, as métricas de logs e cliques já apontam para tabelas reais (`clicks_tracking`, `agent_jobs`), mas o visual carece de maior integridade com KPIs do blog.
4. **Logs Ausentes:** O usuário deseja que os logs de sistema ou agente sejam visualizáveis integralmente na tela.

## Concorrência e Benchmarking
Painéis administrativos de publicadores robustos (ex: Ghost, Sanity, Strapi) entregam:
- Listagem com botão destrutivo acompanhado de Modal de Confirmação (prevenindo miss-clicks).
- Feedback imediato via Toasts.
- KPI focado: Número total de posts ativos, média de leitura, conversão.

## Dependências Identificadas
- Necessário exportar ou adaptar função de deleção em `src/data/posts.ts` ou chamá-la direto da rota de UI usando `supabase.from('posts').delete()`.
- Necessário buscar `posts_count` e afins para os KPIs do dashboard.
