ALTER TABLE products RENAME COLUMN title TO name;
ALTER TABLE products RENAME COLUMN primary_image_url TO hero_image;
ALTER TABLE products ADD COLUMN brand TEXT;
ALTER TABLE products ADD COLUMN spec_summary TEXT;
ALTER TABLE products ADD COLUMN pros JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN cons JSONB DEFAULT '[]'::jsonb;

-- Recriar a view admin_guides_view para garantir que não quebra nada
DROP VIEW IF EXISTS admin_guides_view;
CREATE VIEW admin_guides_view AS
SELECT
  g.id,
  g.headline,
  g.category_slug,
  g.persona_slug,
  g.context_slug,
  g.created_at,
  g.last_revalidated_at,
  COALESCE(COUNT(gp.product_id), 0) AS products_count
FROM guides g
LEFT JOIN guide_products gp ON gp.guide_id = g.id
GROUP BY g.id;
