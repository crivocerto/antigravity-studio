import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Função para que o Bot Python cadastre novas ofertas
export async function POST(request: Request) {
  try {
    // Basic API Key protection
    const authHeader = request.headers.get('authorization') || request.headers.get('x-api-key');
    const expectedKey = process.env.BOT_API_KEY;

    if (!expectedKey) {
      return NextResponse.json({ error: "Server misconfiguration: BOT_API_KEY is not set." }, { status: 500 });
    }

    if (authHeader !== `Bearer ${expectedKey}` && authHeader !== expectedKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validação mínima dos campos requeridos
    if (!body.title || !body.original_price || !body.discount_price || !body.affiliate_url || !body.image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('deals')
      .insert({
        title: body.title,
        original_price: body.original_price,
        discount_price: body.discount_price,
        affiliate_url: body.affiliate_url,
        image_url: body.image_url,
        store: body.store || 'Mercado Livre',
        // default status is active etc. depending on your db defaults
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to insert deal" }, { status: 500 });
    }

    return NextResponse.json({ success: true, deal: data }, { status: 201 });

  } catch (err) {
    console.error("API /api/products crash:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
