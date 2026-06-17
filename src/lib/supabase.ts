import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jebfsjdibuqghnnxjcjn.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplYmZzamRpYnVxZ2hubnhqY2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDA0NzgsImV4cCI6MjA5NzI3NjQ3OH0.FDkxraOaA0M4gb7dqbkW8yJTcSsCePoKrivTCVFIEmI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
