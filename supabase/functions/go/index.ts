import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return Response.redirect(new URL('/', url.origin).toString(), 302)
  }

  try {
    // Inicializa o cliente do Supabase
    // Usa a Service Role Key para ignorar RLS e garantir escrita e leitura rápida no servidor
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Busca a oferta
    const { data: deal, error } = await supabaseClient
      .from('deals')
      .select('affiliate_url')
      .eq('id', id)
      .single()

    if (error || !deal?.affiliate_url) {
      console.error("Error finding deal or missing URL:", error);
      return Response.redirect(new URL('/', url.origin).toString(), 302)
    }

    const affiliateUrl = deal.affiliate_url;

    // 2. Registra o clique
    try {
      await supabaseClient.from('cliques').insert({ deal_id: id })
    } catch (err) {
      console.error("Failed to register click:", err)
    }

    // 3. Redirecionamento Deep Link
    return Response.redirect(affiliateUrl, 302)

  } catch (err) {
    console.error("Critical error in deep linking route:", err);
    return Response.redirect(new URL('/', url.origin).toString(), 302)
  }
})
