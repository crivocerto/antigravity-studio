# Tasks: Admin Full Overhaul (Spec 012)

- [ ] Criar a Supabase Migration `create_admin_daily_metrics_rpc` para o banco de dados.
  - O script SQL deve definir a função RPC `get_7_day_metrics` agrupando cliques das afiliadas.
  - Fazer o deploy (`supabase db push`) ou executar via script para produção.
- [ ] Criar script na raiz do projeto (`simulate_traffic.cjs`) para preencher `guide_views` e `clicks_tracking` retroativamente.
  - Fazer um loop de 7 dias para trás, gerando N page views randômicas (de 10 a 50) e M cliques (Amazon, ML, Shopee) para que o gráfico não fique vazio na tela.
  - Executar o script para popular os dados de teste no ambiente de produção do cliente.
- [ ] Refatorar `src/routes/admin/index.tsx`
  - Remover a variável mockada `CTR_DATA`.
  - Conectar o backend: `const { data } = await supabase.rpc('get_7_day_metrics')`.
  - Mapear os dados reais para o componente `Recharts`.
- [ ] Refatorar a listagem de conteúdo.
  - Excluir e/ou refatorar `src/data/posts.ts` para que puxe da tabela `guides` e `products` utilizando `select('*, guide_products(*, products(*))')`.
  - Reescrever a tabela/lista do arquivo `src/routes/admin/posts.tsx` para não carregar colunas do blog antigo, e sim os Guias e um dropdown dos Produtos rankeados internamente (usando UX Liquid Glass).
- [ ] Atualizar as instruções e prompt de payload em `src/routes/admin/api.tsx` para o formato que a Edge Function do Hermes de fato espera.
- [ ] Validação E2E navegando pelo painel e testando a deleção e expansão de guias.
