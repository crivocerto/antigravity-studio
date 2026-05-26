# Proposal: Resiliência de Mapeamento Supabase e Vite

## Goal
Tornar o código do frontend à prova de falhas de comunicação com o Supabase. Garantir que as variáveis de ambiente do Lovable cheguem no build do Vite sem serem apagadas, e blindar os componentes contra dados `null` ou `undefined`.

## Requisitos
1. **Bulletproof Mapper:** A função `mapPost` no `src/data/posts.ts` deve usar encadeamento opcional e assumir que o Postgres pode retornar o nome do array diferente (ex: `category` ou `categories`) a depender da RLS.
2. **Defesa contra Null Pointers:** Nunca deixar `post.category` ser `undefined`. Se falhar, injetar uma Categoria de Fallback.
3. **Link de Debug Desativado:** Se o post renderizado for um post fake de erro (`id === "error"`), desativar o link de click para o usuário não ser levado a uma tela branca.

## BDD Scenarios

### Cenário: Banco falha ao retornar categorias
- **Given (Dado):** O Supabase retorna os posts, mas falha em fazer o Join das categorias (PostgREST retorna categorias como nulo).
- **When (Quando):** O React tentar renderizar os cards de posts recentes.
- **Then (Então):** A tela não "crasha". A categoria aparece como "Sem Categoria" e o usuário consegue continuar lendo o blog normalmente.

### Cenário: Configuração Inválida do Lovable
- **Given (Dado):** As variáveis do Lovable não batem com o prefixo esperado pelo Vite.
- **When (Quando):** A aplicação inicializa.
- **Then (Então):** A aplicação renderiza o post de aviso vermelho amigável e desativa o link de leitura para que o usuário não se depare com uma tela vazia.
