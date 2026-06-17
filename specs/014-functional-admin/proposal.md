# Proposal: Admin Dashboard 100% Funcional

## Goal
Transformar as páginas de administração em um painel plenamente utilitário, removendo todos os comportamentos de "mock/placeholders" e efetuando ligações reais de CRUD com o Supabase, introduzindo monitoramento avançado e logs.

## Requisitos
1. **Exclusão de Posts:** Botão de lixeira na lista de posts deve remover o post diretamente do Supabase e atualizar a UI.
2. **Logs em Tempo Real:** O Dashboard deve listar logs mais recentes da tabela `agent_jobs` num formato limpo e transparente.
3. **Métricas e KPIs:** Apresentar contadores reais (total de posts, clicks gerais, último log gerado).
4. **Remoção de Mocks:** Impedir que novos posts "falsos" (ex: "TV LG") sejam injetados via interface caso o endpoint do Edge Function falhe. Mostrar o erro real.

## BDD Scenarios

### Cenário: Exclusão Permanente de Post
- **Given (Dado):** O administrador está na aba "Gerenciar Reviews" (`/admin/posts`) e existem 5 posts no banco.
- **When (Quando):** O administrador clica em "Excluir" no review do Aspirador e confirma a exclusão.
- **Then (Então):** O sistema emite um request de DELETE para a tabela `posts`, remove o item do Supabase, apresenta uma mensagem verde de sucesso e a lista é recarregada para 4 posts. Ao atualizar a página, o post permanece apagado.

### Cenário: Visualização de KPIs e Logs
- **Given (Dado):** O administrador está na tela "Visão Geral" (`/admin`).
- **When (Quando):** A página termina de montar (mount).
- **Then (Então):** Os KPIs exibem a contagem exata da tabela `posts` e `clicks_tracking`, acompanhado por uma tabela de atividades recentes buscando da tabela de `agent_jobs`.

### Cenário: Geração de IA Real (Sem Mocks)
- **Given (Dado):** O administrador aperta o botão "Gerar via IA".
- **When (Quando):** A API HTTP para a Edge Function falha por estar offline.
- **Then (Então):** O sistema lança uma mensagem de erro vermelha com a causa real ("Network Error" ou "Endpoint Not Found"), não populando nenhum post fantasma na lista de interface.
