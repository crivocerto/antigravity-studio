# Design: Admin Dashboard Funcional

O painel usará o **Supabase MCP** implicitamente via `supabase-js` para efetuar interações diretas.

## UI/UX (Tendências 2026 - Liquid Glass)
As interfaces atuais em `/admin` já estão bem formatadas, porém serão refinadas:
- Ao clicar em excluir, utilizar o hook nativo JavaScript `window.confirm` envolto numa lógica assíncrona, ou um toast não bloqueante.
- Feedback de erro (ex: falha do agente) não renderizará um post falso; exibirá a mensagem nativa do erro no Alert (Toaster se disponível, senão no state local `message`).

## Data Model Updates
- Nenhuma alteração de Schema necessária. Trabalharemos estritamente com `posts`, `clicks_tracking`, e `agent_jobs` através do client `supabase.from()`.
- Criação de função `deletePost(id)` em `src/data/posts.ts` para ser injetada no componente admin.
