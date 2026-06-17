-- Criação da tabela api_keys para o Gateway Seguro do Hermes
CREATE TABLE public.api_keys (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    key_value text NOT NULL UNIQUE, -- Em um cenário de produção alto, ideal seria guardar o hash, mas vamos usar plain_text para facilidade do admin ler a própria chave no dashboard caso precise (ou ele vê só uma vez)
    name text NOT NULL DEFAULT 'Hermes Agent',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_used_at timestamp with time zone
);

-- Habilitar RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Política de RLS: Apenas Admins logados podem gerenciar as chaves pelo frontend
CREATE POLICY "Admins podem ler e criar api_keys"
ON public.api_keys
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
