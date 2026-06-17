# Design Técnico: Vitrine de Ofertas

## 1. Banco de Dados (Supabase)
Tabela: `deals`
- `id`: uuid
- `title`: text
- `original_price`: numeric
- `discount_price`: numeric
- `image_url`: text
- `affiliate_url`: text
- `category`: text
- `store`: varchar (ex: 'mercadolivre', 'amazon', 'shopee') - Preparado para multi-lojas.
- `status`: varchar (ex: `pending`, `dispatched`)
- `created_at`: timestamp

## 2. Vitrine Web (Next.js - Link in Bio)
- **Padrão Visual**: Mobile-First, Design Clean (estilo Shopee/Pinterest), Fundo Claro.
- **Layout**: 
  - Banner Fixo de Captura no topo (VIP WhatsApp).
  - Barra de Pesquisa e Filtros de Categoria (Casa, Eletrônicos, Beleza).
  - Grid de 2 colunas para os Cards de Produtos.
- **Card do Produto**:
  - Imagem em destaque.
  - Título curto.
  - Preço original riscado.
  - Preço desconto destacado.
  - Botão de Ação "Ver na Loja".
- **Data Fetching**: Componentes Server-Side lendo direto do Supabase em tempo real.
- **Redirecionamento**: Clique redireciona para a URL de afiliado injetando a tag de rastreamento.

## 3. Componentes Futuros (Fora do Escopo Imediato)
- **Caçador/Gerador (Python)**: Será implementado depois. Por ora, os dados podem ser mocados via SQL ou inseridos manualmente no Supabase.
- **Mensageiro (Bot)**: Suspenso temporariamente.

## Cenários de Teste (SDD)
1. **[SCAN]** Usuário entra via celular - **[INFER]** O grid deve se adaptar para 2 colunas perfeitamente, sem quebra de texto - **[VERIFY]** Inspecionar via DevTools (Mobile View).
2. **[SCAN]** Clique no botão do card - **[INFER]** Redirecionamento instantâneo para a `affiliate_url` do banco de dados - **[VERIFY]** Validar o href no componente de link.
3. **[SCAN]** Digitar na barra de pesquisa - **[INFER]** A lista de ofertas deve ser filtrada por título/categoria - **[VERIFY]** Validar se a query no Supabase retorna os dados corretos.
