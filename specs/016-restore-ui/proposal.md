# SDD Proposal: Restauração da Interface Lovable (Vitrine)

## 1. Contexto e Motivação
Durante a migração para a raiz (Next.js), as estilizações legadas (`tailwind.config.js` e `styles.css`) geradas pela Lovable foram excluídas. O "create-next-app" injetou um estilo base de Dark Mode (tela preta) que destruiu a identidade visual do projeto. O objetivo é restaurar o UI Premium (Island Navbar, cores base, fundos brancos) aplicando-o ao layout de Vitrine.

## 2. Limites da API e Mutações
- Nenhuma alteração no backend ou chamadas do Supabase. O foco é estritamente UI/UX.

## 3. Arquitetura da Interface
- **globals.css**: Limpeza do CSS do Next.js. Injeção das variáveis `--color-primary`, `--color-ink`, `--color-surface` baseadas no design antigo.
- **Header**: Restauração do layout "Floating Island" (Navbar com backdrop-blur) original da Lovable, mas simplificado para não exibir a rota "Reviews", preservando a barra de pesquisa expansível e a logo.
- **ProductGrid/Card**: Ajuste das classes de Tailwind para utilizar as variáveis restauradas, garantindo fidelidade de 100% à paleta de cores original.
