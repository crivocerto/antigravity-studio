-- Migration: Admin Daily Metrics RPC & View
-- Cria a RPC de métricas de 7 dias e a view de gerenciamento

CREATE OR REPLACE FUNCTION get_7_day_metrics()
RETURNS TABLE(
  day_date TEXT,
  amazon_clicks BIGINT,
  mercadolivre_clicks BIGINT,
  shopee_clicks BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH last_7_days AS (
    SELECT generate_series(
      CURRENT_DATE - INTERVAL '6 days',
      CURRENT_DATE,
      '1 day'::interval
    )::date AS d
  )
  SELECT
    to_char(d.d, 'DD/MM/YYYY') AS day_date,
    COUNT(c.id) FILTER (WHERE c.platform = 'amazon') AS amazon_clicks,
    COUNT(c.id) FILTER (WHERE c.platform = 'mercadolivre') AS mercadolivre_clicks,
    COUNT(c.id) FILTER (WHERE c.platform = 'shopee') AS shopee_clicks
  FROM last_7_days d
  LEFT JOIN clicks_tracking c 
    ON DATE(c.created_at) = d.d
  GROUP BY d.d
  ORDER BY d.d ASC;
END;
$$ LANGUAGE plpgsql;

-- View para facilitar o agrupamento na tela de admin
CREATE OR REPLACE VIEW admin_guides_view AS
SELECT 
  g.id,
  g.headline,
  g.category_slug,
  g.persona_slug,
  g.context_slug,
  g.created_at,
  g.last_revalidated_at,
  COUNT(gp.product_id) AS products_count
FROM guides g
LEFT JOIN guide_products gp ON g.id = gp.guide_id
GROUP BY g.id;
