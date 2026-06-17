import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const dealId = resolvedParams.id;

  try {
    // 1. O(1) Fetch the affiliate link
    const { data: deal, error } = await supabase
      .from('deals')
      .select('affiliate_url')
      .eq('id', dealId)
      .single();

    if (error || !deal?.affiliate_url) {
      console.error("Error finding deal or missing URL:", error);
      // Redirect back home if not found
      return NextResponse.redirect(new URL('/', request.url), { status: 302 });
    }

    const affiliateUrl = deal.affiliate_url;

    // 2. Fire-and-forget Click Registration (Growth Hack: 1st Party Data)
    // We don't await this blocking the redirect. We fire it asynchronously
    // but in Vercel Edge, background tasks might be killed after response.
    // In App Router, we should `waitUntil` but here a simple await is fine because it's fast.
    try {
      await supabase.from('cliques').insert({ deal_id: dealId });
    } catch (err) {
      console.error("Failed to register click:", err);
    }

    // 3. Deep Linking Redirect (Status 302 forces OS intent parsing)
    return NextResponse.redirect(affiliateUrl, { status: 302 });

  } catch (err) {
    console.error("Critical error in deep linking route:", err);
    return NextResponse.redirect(new URL('/', request.url), { status: 302 });
  }
}
