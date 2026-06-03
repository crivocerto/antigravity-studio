-- Migration: Create Programmatic SEO Tables
-- Features: products, guides, guide_products for the CrivoCerto v3

-- 1. Tabela 'products'
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_slug TEXT NOT NULL,
  crivo_score INTEGER CHECK (crivo_score BETWEEN 0 AND 100),
  score_breakdown JSONB DEFAULT '{}'::jsonb,
  is_trending BOOLEAN DEFAULT FALSE,
  primary_image_url TEXT,
  affiliate_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS e criar política de leitura pública
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Produtos são visíveis publicamente" 
ON products FOR SELECT USING (true);

-- 2. Tabela 'guides'
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_slug TEXT NOT NULL,
  persona_slug TEXT NOT NULL,
  context_slug TEXT NOT NULL,
  url_path TEXT UNIQUE NOT NULL,
  headline TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  faq_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_revalidated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS e criar política de leitura pública
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guias são visíveis publicamente" 
ON guides FOR SELECT USING (true);

-- 3. Tabela 'guide_products' (Many-to-Many)
CREATE TABLE guide_products (
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rank_position INTEGER NOT NULL CHECK (rank_position > 0),
  contextual_pitch TEXT NOT NULL,
  PRIMARY KEY (guide_id, product_id)
);

-- Habilitar RLS e criar política de leitura pública
ALTER TABLE guide_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ponte de guias visível publicamente" 
ON guide_products FOR SELECT USING (true);

-- Funções utilitárias (opcional para manter updated_at sincronizado)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
