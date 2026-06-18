import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // CORS Headers (se o bot chamar via browser, ou frontend chamar via GET futuramente)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }

  try {
    // Validação da Chave da API do Bot
    // Se o cliente enviar o Authorization com Anon key, procuramos a BOT_API_KEY no x-api-key
    const botKeyHeader = req.headers.get('x-api-key') || req.headers.get('authorization')
    const expectedKey = Deno.env.get('BOT_API_KEY')

    if (!expectedKey) {
      return new Response(JSON.stringify({ error: "Server misconfiguration: BOT_API_KEY is not set." }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (botKeyHeader !== `Bearer ${expectedKey}` && botKeyHeader !== expectedKey) {
      return new Response(JSON.stringify({ error: "Unauthorized", debug: "Missing or invalid bot key" }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const body = await req.json()

    // Validação mínima
    if (!body.title || !body.original_price || !body.discount_price || !body.affiliate_url || !body.image_url) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Inicializa o cliente do Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabaseClient
      .from('deals')
      .upsert(
        [
          {
            title: body.title,
            original_price: body.original_price,
            discount_price: body.discount_price,
            image_url: body.image_url,
            affiliate_url: body.affiliate_url,
            store: body.store || 'Mercado Livre',
            categoria: body.categoria || 'geral',
          }
        ],
        { onConflict: 'affiliate_url' }
      )
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return new Response(JSON.stringify({ error: "Failed to insert deal" }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true, deal: data }), { 
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error("API crash:", err)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
