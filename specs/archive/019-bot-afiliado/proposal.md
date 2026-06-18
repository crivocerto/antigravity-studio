# Proposal: Automated Affiliate Link Generation via Session Injection

## Goal
Implementar uma automação no bot de raspagem (`cacador.ts`) que transforme links orgânicos do Mercado Livre em links encurtados de afiliado oficiais, utilizando injeção de sessão (cookies autenticados) para acessar o painel de parceiros do Mercado Livre silenciosamente.

## Context
Atualmente, o robô extrai com sucesso os produtos (furando o WAF via Stealth Mode) e os persiste no Supabase. No entanto, o `affiliate_url` armazenado é o link cru do produto. Para que a operação converta vendas para o usuário, o bot deve acessar o Gerador de Links do Mercado Livre como um usuário logado e converter as URLs cruas antes da injeção no Supabase.

## Proposed Solution
1. **Injeção de Sessão (Cookies)**: Carregar o estado autenticado do usuário através de um arquivo `cookies.json`.
2. **Navegação Stealth**: Utilizar o `playwright-extra` para navegar até a página do Gerador de Links.
3. **Conversão Dinâmica**: 
   - Para cada produto extraído, preencher o input do gerador com a URL orgânica.
   - Clicar em gerar e capturar a URL encurtada de resposta (`https://mercadolivre.com/sec/...`).
4. **Persistência**: Enviar o payload para a Edge Function do Supabase já contendo o link afiliado.

## Impact & Risks
- **Risco**: Expiração dos cookies. Se os cookies expirarem, a automação falhará e exigirá nova exportação manual.
- **Impacto**: Automação 100% de ponta-a-ponta. Os produtos aparecerão na vitrine prontos para comissionamento.
