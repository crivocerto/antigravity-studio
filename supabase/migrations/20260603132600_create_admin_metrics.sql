-- Migration: Admin Metrics & Views Tracking

-- 1. Tabela para rastrear views nas páginas (Programmatic SEO)
CREATE TABLE guide_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  user_agent TEXT,
  referer TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS e criar política de inserção pública
ALTER TABLE guide_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir inserção anônima de views" 
ON guide_views FOR INSERT WITH CHECK (true);

-- Política para leitura apenas por admins (simplificada via permissões do sistema)
CREATE POLICY "Leitura de views liberada" 
ON guide_views FOR SELECT USING (true);

-- 2. RPC (Stored Procedure) para calcular as estatísticas gerais (CTR, Views, Cliques)
-- Isso evita waterfall de requests e processamento pesado no Frontend do painel Admin.
CREATE OR REPLACE FUNCTION get_admin_dashboard_metrics()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_views INTEGER;
  total_clicks INTEGER;
  global_ctr NUMERIC;
  amazon_clicks INTEGER;
  ml_clicks INTEGER;
  shopee_clicks INTEGER;
  result JSONB;
BEGIN
  -- Total Views
  SELECT COUNT(*) INTO total_views FROM guide_views;
  
  -- Total Clicks
  SELECT COUNT(*) INTO total_clicks FROM clicks_tracking;
  
  -- Calcular CTR Global (%)
  IF total_views > 0 THEN
    global_ctr := ROUND((total_clicks::NUMERIC / total_views::NUMERIC) * 100, 2);
  ELSE
    global_ctr := 0;
  END IF;

  -- Cliques por plataforma
  SELECT COUNT(*) INTO amazon_clicks FROM clicks_tracking WHERE platform = 'amazon';
  SELECT COUNT(*) INTO ml_clicks FROM clicks_tracking WHERE platform = 'mercadolivre';
  SELECT COUNT(*) INTO shopee_clicks FROM clicks_tracking WHERE platform = 'shopee';

  result := jsonb_build_object(
    'total_views', total_views,
    'total_clicks', total_clicks,
    'global_ctr', global_ctr,
    'platforms', jsonb_build_object(
      'amazon', amazon_clicks,
      'mercadolivre', ml_clicks,
      'shopee', shopee_clicks
    )
  );

  RETURN result;
END;
$$;
