# Design Document: Arquitetura da Raiz

## Motivação
A estrutura do projeto estava dividida entre:
1. `antigravity-studio/` (Raiz): Frontend antigo em Vite, focado em reviews de produtos com roteamento TanStack Router.
2. `vitrine-ofertas/`: Novo frontend em Next.js focado em conversões, links de afiliados e UI Mobile-First.

## Decisão de Engenharia
Eliminar a pasta `vitrine-ofertas` e fundir seu conteúdo na raiz. O código legado do Vite será expurgado e o `package.json` será substituído pelas configurações do Next.js.

## Migração Segura
Como a raiz do projeto já tem `.git`, `.agent`, `.lovable` e scripts (`fix.cjs`, etc.), vamos apagar apenas os artefatos de framework frontend específicos (`src/routes`, `vite.config.ts`, `tailwind.config.js` antigo, `postcss.config.js`) antes de jogar os arquivos da vitrine para cima.
