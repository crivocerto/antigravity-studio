-- Limpa a tabela de deals (conforme solicitado para remover dados embaralhados)
TRUNCATE TABLE public.deals CASCADE;

-- Adiciona constraint para evitar duplicação
ALTER TABLE public.deals ADD CONSTRAINT deals_affiliate_url_key UNIQUE (affiliate_url);
