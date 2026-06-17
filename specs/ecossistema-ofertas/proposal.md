# Proposta: Ecossistema de Ofertas

## Objetivo
Criar um pipeline 100% autônomo que caça, converte e distribui ofertas no automático.

## Módulos
1. **Caçador**: Script Python para Scraping (BeautifulSoup/Playwright) do Mercado Livre. Filtragem por % de desconto, reputação MercadoLíder e frete Full.
2. **Gerador de Links**: Script Python acoplado ao Caçador para converter a URL extraída na URL de afiliado.
3. **Vitrine Web**: Frontend Next.js (App Router) conectado ao Supabase para exibição das ofertas e Call-To-Action (CTA) para grupo VIP.
4. **Mensageiro**: Bot em Python (Telegram/WhatsApp Cloud API) para buscar novos produtos no Supabase e enviar formatações apelativas aos grupos.

## Banco de Dados
A escolha oficial será **Supabase (PostgreSQL)**, mantendo a coerência com a `memory.md`. Supabase servirá de Hub central (Single Source of Truth) para sincronizar o Python e o Next.js.
