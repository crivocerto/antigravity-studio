-- Cria a tabela de cliques se não existir
CREATE TABLE IF NOT EXISTS public.cliques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ativa RLS
ALTER TABLE public.cliques ENABLE ROW LEVEL SECURITY;

-- Permite inserção anônima (para a edge function caso use anon key, apesar de que ela usa service_role_key)
CREATE POLICY "Allow insert for all" ON public.cliques FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for authenticated" ON public.cliques FOR SELECT TO authenticated USING (true);

-- Índices de performance
CREATE INDEX IF NOT EXISTS cliques_deal_id_idx ON public.cliques (deal_id);

-- RPC para buscar o Top 5 deals mais clicados
CREATE OR REPLACE FUNCTION public.get_top_deals()
RETURNS TABLE (
    deal_id UUID,
    title TEXT,
    original_price NUMERIC,
    discount_price NUMERIC,
    image_url TEXT,
    affiliate_url TEXT,
    categoria TEXT,
    clicks_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        d.id as deal_id,
        d.title,
        d.original_price,
        d.discount_price,
        d.image_url,
        d.affiliate_url,
        d.categoria,
        COUNT(c.id) as clicks_count
    FROM public.deals d
    LEFT JOIN public.cliques c ON d.id = c.deal_id
    GROUP BY d.id
    ORDER BY clicks_count DESC
    LIMIT 5;
$$;

-- Limpeza da categoria maquiagem errada
DELETE FROM public.deals WHERE categoria = 'maquiagem';
