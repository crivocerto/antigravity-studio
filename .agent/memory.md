# Memória Contínua (ClawHub Agent)

## Preferências de Arquitetura
- Frontend: Padrões de UI baseados em `frontend-design-pro` e `afrexai-nextjs-production`. Forte preferência por interfaces "Mobile-First" voltadas à conversão (estilo Link-in-Bio / Shopee / Pinterest), com Cards de destaque, preços riscados, Badges (ex: -40%), e Banners VIP fixos, sem esquecer a responsividade Web (uso de grids em Tailwind).
- Backend: Supabase com Row Level Security (RLS). Estruturas de banco de dados devem ser pensadas como multi-loja/multi-tenant (ex: Amazon, ML, Shopee) desde o princípio em sistemas de afiliação.
- CLI/Workflow: Headless puro. Autenticação via `GH_TOKEN` e `SUPABASE_ACCESS_TOKEN`. Git configurado com `ai@clawhub.com` e `ClawHub Agent`. Sem comandos interativos.
- Ferramentas: PowerShell com separação via `;` e subshell `cmd.exe /c` para `.ps1` com erro de policy.
- Hospedagem e Escalabilidade: Sistemas estáticos (Lovable) não suportam rotas de API ou Edge Functions. Para funis de Growth agressivos (Deep Linking, tracking no servidor), o projeto DEVE usar Server Components (`revalidate`) e ser hospedado na Vercel.

## Erros Passados
- **Supabase Token Parsing**: Variáveis de ambiente no PowerShell falham ao encadear `$env:VAR="x"; npx supabase` devido a erros na política de execução do npx ou perda de contexto. Solução confiável: usar `cmd.exe /c "npx supabase login --token XXX"`.
- **PowerShell vs Quotes**: Encapsular comandos longos com aspas dentro de `cmd.exe /c "..."` pode causar *Unrecognized token in source text* se não for muito bem escapado (ex: `--import-alias "@/*"`). Evite passar flags complexas por subshell se o padrão bastar.
- **Corrupção de node_modules na Migração de Pastas**: Ao mover um projeto Next.js gerado em subpasta para a raiz que já continha outro framework (ex: Vite), o uso de `xcopy` ou `move` misturado com pastas antigas corrompe as dependências (causando erro de *module not found* como o do `caniuse-lite`). **Ação corretiva definitiva**: sempre execute `rmdir /S /Q node_modules && rmdir /S /Q .next` e então um `npm install` limpo após movimentações massivas de arquivos de configuração.
- **Next.js 15+ Route Params Promise**: Ao acessar `{ params }` em `route.ts`, os parâmetros agora são assíncronos. O uso de `params.id` síncrono causa erro de build. **Ação corretiva**: Sempre use `const resolvedParams = await params;`.
- **Git Push Protection Block**: Compilar o Next.js localmente num diretório rastreado pelo Git (como `dist/` ou `.next/`) pode vazar variáveis de ambiente (`.env.local`) em arquivos de cache (`_buildManifest`, logs). Sempre garanta que a pasta de output esteja no `.gitignore` antes de rodar `git add .` se o repositório possuir segredos.
- **Playwright Stealth & Anti-Bot**: O Mercado Livre usa SPA pesado e shadow DOM no painel de afiliados, tornando seletores CSS não-confiáveis para extrair URLs geradas. **Ação corretiva**: Em bots headless (Playwright), injete cookies de sessão autêntica, ative permissões de clipboard (`['clipboard-read', 'clipboard-write']`), simule o clique no botão nativo de "Copiar" da plataforma e intercepte o link resultante via `navigator.clipboard.readText()`. Isso anula qualquer complexidade de scraping da DOM.

## Persona do Usuário
- Foco em produtividade e workflows invisíveis/headless.
- Usa ClawHub para automação e vibe coding.
- Exige validação rigorosa antes de implementações (proposals).
- Foca pesadamente em conversão (CRO) e "Caminho do Dinheiro" nas UIs (ex: redirect imediato 302 pulando browser interno, CTAs agressivos, rastreamento de cliques (1st party data)). A experiência primária do usuário (ex: Linktree/Vitrine) deve sempre ficar na raiz principal do repositório, não em subpastas.
