# Spec Plan: Vitrine de Ofertas

## Fase 1: Infraestrutura e Dados Multi-loja (Supabase)
- [ ] Criar projeto Supabase e capturar credenciais (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
- [ ] Criar tabela `deals` com suporte a `store` (ML, Amazon, Shopee).
- [ ] Configurar Row Level Security (RLS) para leitura pública anonimizada.
- [ ] Popular com 4 a 6 dados *mockados* (eletrônicos, casa) para testar a UI.

## Fase 2: Fundação da Vitrine Web (Next.js)
- [ ] Executar `npx -y create-next-app@latest vitrine-ofertas` (App Router, Tailwind).
- [ ] Configurar layout global com foco 100% Mobile First.
- [ ] Criar Header com Barra de Pesquisa e Categorias.
- [ ] Criar Banner de Captura VIP WhatsApp no topo.

## Fase 3: Componentes de Produto
- [ ] Criar componente `ProductCard`:
  - Imagem, Título Curto.
  - Preço Antigo (riscado) e Preço Novo (destaque).
  - Botão de compra e lógica de redirecionamento.
- [ ] Criar componente `ProductGrid` (2 colunas em mobile).

## Fase 4: Integração Supabase
- [ ] Instalar `@supabase/supabase-js`.
- [ ] Fetch dos produtos em Server Component e mapeamento no Grid.
- [ ] Implementar estado/busca para a barra de pesquisa e filtros.
