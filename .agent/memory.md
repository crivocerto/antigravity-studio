# Memória Contínua (ClawHub Agent)

## Preferências de Arquitetura
- Frontend: Padrões de UI baseados em `frontend-design-pro` e `afrexai-nextjs-production`. Forte preferência por interfaces "Mobile-First" voltadas à conversão (estilo Link-in-Bio / Shopee / Pinterest), com Cards de destaque, preços riscados, Badges (ex: -40%), e Banners VIP fixos, sem esquecer a responsividade Web (uso de grids em Tailwind).
- Backend: Supabase com Row Level Security (RLS). Estruturas de banco de dados devem ser pensadas como multi-loja/multi-tenant (ex: Amazon, ML, Shopee) desde o princípio em sistemas de afiliação.
- CLI/Workflow: Headless puro. Autenticação via `GH_TOKEN` e `SUPABASE_ACCESS_TOKEN`. Git configurado com `ai@clawhub.com` e `ClawHub Agent`. Sem comandos interativos.
- Ferramentas: PowerShell com separação via `;` e subshell `cmd.exe /c` para `.ps1` com erro de policy.

## Erros Passados
- **Supabase Token Parsing**: Variáveis de ambiente no PowerShell falham ao encadear `$env:VAR="x"; npx supabase` devido a erros na política de execução do npx ou perda de contexto. Solução confiável: usar `cmd.exe /c "npx supabase login --token XXX"`.
- **PowerShell vs Quotes**: Encapsular comandos longos com aspas dentro de `cmd.exe /c "..."` pode causar *Unrecognized token in source text* se não for muito bem escapado (ex: `--import-alias "@/*"`). Evite passar flags complexas por subshell se o padrão bastar.
- **Corrupção de node_modules na Migração de Pastas**: Ao mover um projeto Next.js gerado em subpasta para a raiz que já continha outro framework (ex: Vite), o uso de `xcopy` ou `move` misturado com pastas antigas corrompe as dependências (causando erro de *module not found* como o do `caniuse-lite`). **Ação corretiva definitiva**: sempre execute `rmdir /S /Q node_modules && rmdir /S /Q .next` e então um `npm install` limpo após movimentações massivas de arquivos de configuração.

## Persona do Usuário
- Foco em produtividade e workflows invisíveis/headless.
- Usa ClawHub para automação e vibe coding.
- Exige validação rigorosa antes de implementações (proposals).
- Foca pesadamente em conversão e "Caminho do Dinheiro" nas UIs (ex: redirect imediato, CTA forte). A experiência primária do usuário (ex: Linktree/Vitrine) deve sempre ficar na raiz principal do repositório, não em subpastas.
