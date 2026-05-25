## Relatório curto e objetivo

**Diagnóstico:** os reviews não sumiram do banco; o app é que voltou a apontar para um Supabase fake.

**Prova dura:** as requisições do preview estão indo para `https://placeholder-project.supabase.co/rest/v1/posts` com `placeholder-anon-key`, então **nem chegam no seu projeto real** (`sqittiosnjiwfwbdcypu`).

**Causa raiz:** em `src/integrations/supabase/client.ts` existe fallback silencioso para placeholder quando as envs não entram no runtime. Isso mascara a falha de configuração e transforma um erro claro de ambiente em “sumiço de reviews”.

**Conclusão incisiva:** o problema hoje **não é banco, nem RLS, nem conteúdo**. É **configuração frágil de cliente Supabase + ausência de fail-fast**. Depois de commits/rebuilds, a app degrada para um endpoint inválido sem travar de forma explícita.

## Plano de blindagem

1. **Remover fallback para placeholder**
   - Eliminar URLs/chaves fake do cliente Supabase.
   - Se faltar env, quebrar com erro explícito e mensagem clara.

2. **Centralizar a configuração do Supabase**
   - Manter um único ponto oficial de import do client.
   - Impedir múltiplas formas de resolver URL/key.

3. **Fail-fast com diagnóstico legível**
   - Mostrar erro claro quando `VITE_SUPABASE_URL` ou `VITE_SUPABASE_PUBLISHABLE_KEY` estiver ausente.
   - Evitar que loaders tentem buscar dados em endpoint inválido.

4. **Blindar a camada de dados dos reviews**
   - Padronizar `getPosts`, `getFeaturedPosts`, `getCategories` e `getPostBySlug` para usar somente o client oficial.
   - Revisar imports soltos e acessos paralelos ao Supabase.

5. **Adicionar verificação de sanidade**
   - Validar em runtime que a URL usada contém o project ref correto (`sqittiosnjiwfwbdcypu`).
   - Se não contiver, logar erro crítico imediatamente.

6. **Reduzir risco de regressão pós-commit**
   - Revisar páginas `/`, `/reviews` e `/review/$slug` para não esconder falhas de conexão como se fossem “lista vazia”.
   - Exibir estado de erro real em vez de parecer ausência de conteúdo.

## Detalhes técnicos

- Arquivo principal sob suspeita: `src/integrations/supabase/client.ts`
- Sintoma capturado: requests para `placeholder-project.supabase.co`
- Tabelas não parecem ser o gargalo atual:
  - `posts`: leitura pública liberada
  - `categories`: leitura pública liberada
- Logo, **RLS não é o primeiro alvo da correção** neste incidente.

## Entrega da implementação

Vou aplicar a blindagem em duas frentes:
- **Correção imediata:** impedir placeholder e restaurar leitura dos reviews
- **Blindagem estrutural:** tornar impossível esse sumiço silencioso voltar após novos commits