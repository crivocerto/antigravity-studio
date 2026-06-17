CREATE TABLE public.deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    original_price NUMERIC,
    discount_price NUMERIC,
    image_url TEXT,
    affiliate_url TEXT NOT NULL,
    category TEXT,
    store VARCHAR(50) DEFAULT 'mercadolivre',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Enable read access for all users" ON public.deals FOR SELECT USING (true);

-- Insert mock data
INSERT INTO public.deals (title, original_price, discount_price, image_url, affiliate_url, category, store) VALUES
('Air Fryer Mondial 4L', 499.90, 299.90, 'https://http2.mlstatic.com/D_NQ_NP_2X_897368-MLA74063236746_012024-F.webp', 'https://mercadolivre.com/afiliado/1', 'Casa', 'mercadolivre'),
('Smartphone Samsung Galaxy S23', 4999.00, 3999.00, 'https://http2.mlstatic.com/D_NQ_NP_2X_995315-MLU74668508962_022024-F.webp', 'https://mercadolivre.com/afiliado/2', 'Eletrônicos', 'mercadolivre'),
('Fone de Ouvido Bluetooth JBL', 259.90, 159.90, 'https://http2.mlstatic.com/D_NQ_NP_2X_892330-MLA48744062828_012022-F.webp', 'https://amazon.com/afiliado/3', 'Eletrônicos', 'amazon'),
('Kit Skincare La Roche-Posay', 320.00, 210.00, 'https://http2.mlstatic.com/D_NQ_NP_2X_813093-MLA72422709149_102023-F.webp', 'https://shopee.com/afiliado/4', 'Beleza', 'shopee');
