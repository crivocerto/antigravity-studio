# Tarefas: Spec 014 (Admin Dashboard 100% Funcional)

- `[ ]` 14.1 Implementar `deletePost(id: string)` em `src/data/posts.ts` para deletar a row no Supabase.
- `[ ]` 14.2 Conectar botão de Lixeira em `src/routes/admin/posts.tsx` à nova função `deletePost`, adicionando recarregamento da lista `fetchPosts()`.
- `[ ]` 14.3 Remover lógica de Mock de `handleGenerateAI` no `posts.tsx` e garantir que o erro de "Network" seja retornado de fato à tela.
- `[ ]` 14.4 Aprimorar KPIs em `src/routes/admin/index.tsx` injetando contador de total de posts e listagem em tempo real de logs da tabela `agent_jobs`.
- `[ ]` 14.5 Executar teste local para verificar a exclusão real no BD.
