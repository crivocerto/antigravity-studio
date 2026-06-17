# Global Constraints

- **Backend / Database**: Supabase (PostgreSQL) com RLS obrigatório.
- **Frontend**: Next.js (App Router), `frontend-design-pro`.
- **APIs**: Uso rigoroso de variáveis de ambiente no Supabase.
- **Scraping**: Respeitar limites de taxa (rate limits) e mitigar bloqueios via estratégias de cabeçalhos/proxies.
- **Bots de Mensagem**: Utilizar APIs oficiais preferencialmente (Cloud API Meta) ou integrações robustas (Baileys) para evitar banimentos por spam.
