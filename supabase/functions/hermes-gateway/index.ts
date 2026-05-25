import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Trata preflight request (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // Cria o cliente Supabase com a chave Mestra para verificar o banco de dados interno
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Valida se a chave informada existe na tabela api_keys
    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select("*")
      .eq("key_value", token)
      .single();

    if (keyError || !keyData) {
      return new Response(JSON.stringify({ error: "Invalid API Key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Registra quando a chave foi usada
    await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id);

    // Lê o corpo da requisição enviada pelo Hermes
    const body = await req.json();
    const { action, payload } = body;

    let responseData = null;

    // Roteador de ações permitidas
    switch (action) {
      case "get_categories":
        const { data: cats, error: catErr } = await supabase.from("categories").select("id, slug, name");
        if (catErr) throw catErr;
        responseData = cats;
        break;

      case "insert_post":
        const { data: newPost, error: postErr } = await supabase
          .from("posts")
          .insert([payload])
          .select()
          .single();
        if (postErr) throw postErr;
        responseData = newPost;
        break;

      case "log_job":
        // Atualiza ou insere log na tabela agent_jobs
        const { data: job, error: jobErr } = await supabase
          .from("agent_jobs")
          .upsert([
            {
              id: payload.id || undefined,
              status: body.status || "running",
              action: payload.task || "unknown",
              metadata: body.metadata || {},
              completed_at: body.status !== "running" ? new Date().toISOString() : null
            }
          ])
          .select()
          .single();
        if (jobErr) throw jobErr;
        responseData = job;
        break;

      default:
        return new Response(JSON.stringify({ error: `Action '${action}' not supported by Gateway` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Gateway error:", error.message);
    return new Response(JSON.stringify({ error: "Internal Gateway Error", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
