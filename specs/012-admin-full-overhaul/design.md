# Design Document: Admin Full Overhaul (Spec 012)

## 1. Supabase Database Design

Para suportar o gráfico nativo de 7 dias no `index.tsx`, precisaremos de uma nova Function RPC chamada `get_7_day_metrics`. O RPC atual (`get_admin_dashboard_metrics`) retorna o acumulado global do portal. Precisamos de um que retorne as estatísticas dia a dia.

**RPC Proposto (`get_7_day_metrics`):**
Retornar um JSON ou Table contendo:
- `date` (Os últimos 7 dias sequenciais, ex: "03/06/2026")
- `amazon` (count de cliques da amazon naquele dia)
- `mercadolivre` (count de cliques no ML naquele dia)
- `shopee` (count de cliques na Shopee)

Para as listagens de conteúdo, precisaremos de uma visão agregada para facilitar o carregamento no Admin, evitando multi-queries custosas no client.

**View Proposta (`admin_guides_view`):**
- Traz dados da tabela `guides`
- Aplica um Left Join para contar produtos associados.

## 2. Stitch MCP UI Design

**Padrão Visual:** `Apple Liquid Glass` + `Maximalismo Tátil`
**Paleta:** Black Zinc (Fundo), Emerald Green (Destaques e CTAs).

### Divisão de Componentes (Stitch/React):

**1. `index.tsx` (Dashboard Overview):**
- Remover o mock `CTR_DATA`.
- Trocar para um hook `useSevenDayMetrics()` que chama a nova RPC via Supabase e preenche o gráfico `Recharts` real-time.
- O visual do gráfico já está desenhado (Bento Grid dark), só mudaremos o motor.

**2. `posts.tsx` (agora 'Gerenciamento de Conteúdo'):**
- Abandonar a table `posts` (que continha foto hero e avaliações legadas de blog).
- **Header:** Manter os botões e títulos (Liquid Glass UI).
- **Table/List:**
  - Coluna 1: Nome do Guia (ex: `Os 3 Melhores Fones...`)
  - Coluna 2: Categoria (ex: `fones-bluetooth`)
  - Coluna 3: Persona (ex: `audiolofilos-e-casuais`)
  - Coluna 4: Contexto (ex: `melhor-custo-beneficio-2026`)
  - Coluna 5: Produtos Linkados (Badge contagem, ex: `3 Produtos`)
- Em 2026, tabelas gigantes perdem força para **Cards Acordeões**. Ao clicar no Guia, um dropdown suave revela a tabela interna dos produtos rankeados 1º, 2º e 3º, e a imagem primária de cada um.

**3. `api.tsx`:**
- Atualizar a UI de código `systemPrompt` para o Hermes, demonstrando perfeitamente o novo JSON esperado. O resto do arquivo (gerador de token) já é funcional e usa design premium.

## 3. Acessibilidade (WCAG 2.2)
- Garantir contrastes de no mínimo 4.5:1 nos badges de categoria de guia e nos textos de status.
- Implementar skeletons de loading ao puxar o gráfico e a listagem de guias.
