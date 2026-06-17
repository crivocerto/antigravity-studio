# Design: UI Limpa e Conversão Otimizada

Seguindo o estilo `Apple Liquid Glass` e focando em maximizar o CTR (Click-Through Rate):

## Mudança Visual nos Botões de Compra (Review Page)
Os cartões de CTA de compra não terão mais a div contendo `R$ XX,XX`.
O layout será simplificado para focar puramente no logotipo da plataforma e no Call-to-Action.

**Antes:**
[Logo Amazon] Amazon
R$ 299,90 -> Ver na Amazon

**Depois (Mais Limpo e com Gatilho):**
[Logo Amazon] Amazon
"Ver Preço Atualizado" / "Acessar Loja" (com um pequeno ícone de seta/ExternalLink).

## Estrutura de Rotas (Stitch UI)
- `src/routes/afiliados.tsx` -> [DELETADO]
- O Router e Navbar serão atualizados para refletir essa remoção, criando uma jornada de usuário mais fluida e direta.

**Nota de UX 2026:**
Menos é mais. Disclaimers flutuantes quebrando o Liquid Glass diminuíam a retenção. Ao remover o alerta fixo de afiliados, a experiência volta a ser Premium e Imersiva.
