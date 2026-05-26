# Proposal: Parsing Automático de Payloads de IA

## Goal
Ensinar o blog a "ler e interpretar" posts onde o conteúdo foi salvo como um payload JSON pela inteligência artificial, transformando-os em objetos `Post` perfeitos e compatíveis com os componentes da UI, sem precisar alterar a rotina de inserção do cronjob.

## Requisitos
1. **Deteção Automática:** O `mapPost` deve tentar fazer `JSON.parse` em `dbPost.content`.
2. **Hidratação de Campos (Hydration):** Se for JSON, o `mapPost` deve extrair:
   - `hero_image` -> A partir de `json.hero_image`
   - `rating` -> A partir de `json.crivo_meter / 10` (pois o crivo_meter vem como 81, e a UI usa 8.1)
   - `content` -> A partir de `json.body`
   - `pros` / `cons` -> A partir de `json.pros` e `json.cons`
   - `excerpt` -> Gerar automaticamente cortando os primeiros 150 caracteres do `json.body` (já que a IA deixou vazio).
   - `affiliateLinks` -> Montar a array a partir de `json.price_amazon` e `json.price_ml`.

## BDD Scenarios

### Cenário: Renderizando Post Clássico (Legado)
- **Given (Dado):** O Supabase retorna o post "JBL Tune 520BT" onde o `content` é Markdown puro.
- **When (Quando):** O mapeador tenta fazer o parse JSON e falha (lança erro no try/catch).
- **Then (Então):** O erro é silenciado e o mapeador utiliza os campos originais do banco de dados normalmente.

### Cenário: Renderizando Post de IA (Novo formato)
- **Given (Dado):** O Supabase retorna o post "Ekaza 4L" com um JSON dentro de `content`.
- **When (Quando):** O mapeador faz o parse com sucesso.
- **Then (Então):** A imagem da Unsplash aparece no card, a nota é convertida para 8.1, e o texto da review aparece em Markdown limpo na página de leitura.
