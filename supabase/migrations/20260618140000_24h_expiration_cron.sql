-- Enable pg_cron extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the scheduled job to delete deals older than 24 hours
-- Runs every day at midnight (0 0 * * *)
SELECT cron.schedule(
    'delete_expired_deals',
    '0 0 * * *',
    $$DELETE FROM public.deals WHERE created_at < NOW() - INTERVAL '24 hours'$$
);
