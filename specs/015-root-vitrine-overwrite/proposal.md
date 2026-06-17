# Proposta: Eliminação do App Antigo (Reviews) e Substituição pela Vitrine

## Objetivo
O usuário reportou que a "reformulação" não teve efeito na URL principal do projeto. Isso ocorreu porque a Vitrine em Next.js foi gerada na sub-pasta `vitrine-ofertas`, enquanto o frontend antigo (Vite, voltado para "Reviews honestos") continuou rodando na raiz do projeto. O objetivo agora é **destruir a aplicação antiga** e elevar a Vitrine para a raiz do repositório.

## Plano de Ação
1. **Limpeza da Raiz**: Deletar os artefatos do Vite (`index.html`, `vite.config.ts`, `src/routes`, pasta `public` antiga).
2. **Promoção do Next.js**: Mover o conteúdo da pasta `vitrine-ofertas` para a raiz `antigravity-studio`.
3. **Resolução de Conflitos**: Mesclar os `package.json` ou sobrescrever o da raiz completamente com o do Next.js para evitar dependências mortas.
