# Spec Plan: Substituição da Raiz pela Vitrine

## Fase 1: Limpeza do Passado
- [ ] Deletar `vite.config.ts`, `index.html`, `src/routes`, `src/main.tsx`, `src/router.tsx` e dependências antigas.
- [ ] Deletar `postcss.config.js` e `tailwind.config.js` (O Next 15 usa v4 que não precisa destes arquivos de config antigos).

## Fase 2: Elevação do Next.js
- [ ] Mover todo o conteúdo de `vitrine-ofertas/` (incluindo `.env.local`, `src/app`, `next.config.ts`) para a pasta raiz `antigravity-studio/`.
- [ ] Atualizar o `package.json` da raiz para usar o ecossistema Next.js.
- [ ] Apagar a pasta `vitrine-ofertas` que ficará vazia.

## Fase 3: Reinicialização e Verificação
- [ ] Rodar `npm install` na raiz para consolidar os pacotes.
- [ ] Executar o `npm run dev` a partir da raiz para verificar se a vitrine substituiu com sucesso os reviews.
