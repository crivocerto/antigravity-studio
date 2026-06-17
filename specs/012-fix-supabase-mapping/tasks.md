# Tarefas: Spec 012

- `[ ]` 12.1 Atualizar `src/data/posts.ts`: refatorar a função `mapPost` para ser ultra-resiliente, usando fallback default se `dbPost.categories` vier nulo ou com chaves erradas.
- `[ ]` 12.2 Atualizar `src/components/blog/PostCard.tsx`: Condicionar o envolto de `<Link>` para que, se o slug for `"error"`, ele não seja um link clicável.
- `[ ]` 12.3 (Opcional caso ainda dê erro) Instruir o usuário a colar manualmente o token do Supabase na tab "Secrets" do Lovable com a chave `VITE_SUPABASE_ANON_KEY`.
