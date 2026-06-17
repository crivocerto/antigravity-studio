-- Create clicks_tracking table for affiliate click telemetry
CREATE TABLE IF NOT EXISTS public.clicks_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('amazon', 'mercadolivre', 'shopee')),
    affiliate_url TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on clicks_tracking
ALTER TABLE public.clicks_tracking ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated inserts
CREATE POLICY "Allow public insert" ON public.clicks_tracking 
    FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

-- Allow authenticated users to view clicks
CREATE POLICY "Allow select for authenticated" ON public.clicks_tracking 
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Create admin_settings table for secure configuration keys (APIs, tokens)
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (admins) only
CREATE POLICY "Allow all for authenticated" ON public.admin_settings 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Indexes for telemetry query performance
CREATE INDEX IF NOT EXISTS clicks_tracking_created_at_idx ON public.clicks_tracking (created_at DESC);
CREATE INDEX IF NOT EXISTS clicks_tracking_post_id_idx ON public.clicks_tracking (post_id);
CREATE INDEX IF NOT EXISTS clicks_tracking_platform_idx ON public.clicks_tracking (platform);
