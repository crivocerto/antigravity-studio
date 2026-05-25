-- Criar tabela de auditoria para o Hermes (IA Autônoma)
CREATE TABLE public.agent_jobs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at timestamp with time zone,
    status text NOT NULL CHECK (status IN ('running', 'success', 'failed')),
    action text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Habilitar RLS na tabela agent_jobs
ALTER TABLE public.agent_jobs ENABLE ROW LEVEL SECURITY;

-- Política de RLS: Admins (authenticated) podem ler os jobs
CREATE POLICY "Admins podem visualizar agent_jobs" 
ON public.agent_jobs
FOR SELECT 
TO authenticated 
USING (true);

-- Nota: O Hermes (Service Role Key) bypassa o RLS nativamente, então não precisa de policy para INSERT/UPDATE.

-- Extensões necessárias para o Cron autônomo
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Criar a rotina autônoma de heartbeat que pinga o Hermes a cada 2 horas
-- NOTA: Como pg_cron roda no banco de dados e pg_net faz chamadas externas,
-- essa configuração é um exemplo. A URL real do Hermes deve ser atualizada aqui
-- ou mantida pelo usuário nas configurações do webhook.
SELECT cron.schedule(
  'hermes-heartbeat',
  '0 */2 * * *',
  $$
    SELECT net.http_post(
      url := 'https://api.hermes-agent.com/webhook/trigger', -- Substitua pela URL real do Hermes
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := '{"action": "generate_content", "site": "crivocerto"}'::jsonb
    );
  $$
);
