import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (supabaseUrl === "https://placeholder-project.supabase.co" || supabaseAnonKey === "placeholder-anon-key") {
  console.warn("Supabase URL or Anon Key is missing. Using local fallback placeholders.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
