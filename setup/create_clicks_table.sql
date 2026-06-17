-- Migration: Create cliques table for 1st Party Data tracking
CREATE TABLE IF NOT EXISTS public.cliques (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.cliques ENABLE ROW LEVEL SECURITY;

-- Politica para permitir INSERTS não autenticados (usado pelo backend/Next.js)
-- Assumindo que a Edge Function use a chave do service_role, ela ignora o RLS.
-- Caso o Next.js utilize a chave anônima (anon key), habilite a seguinte política:
CREATE POLICY "Permitir inserções anonimas em cliques" 
ON public.cliques FOR INSERT 
TO public 
WITH CHECK (true);

-- Politica para permitir leitura apenas por usuários autenticados (Admin)
CREATE POLICY "Permitir leitura apenas de admins" 
ON public.cliques FOR SELECT 
TO authenticated 
USING (true);
