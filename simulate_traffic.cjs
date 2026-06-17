const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
envLocal.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) process.env[key.trim()] = value.trim();
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Para forçar a inserção caso RLS bloqueie, usaremos a chave do Gateway ou apenas tentamos com a anon
const supabase = createClient(supabaseUrl, supabaseKey);

async function simulateTraffic() {
  console.log("Iniciando simulação de tráfego de 7 dias...");

  // Pegar 1 guia e 1 produto
  const { data: guides } = await supabase.from('guides').select('id').limit(1);
  const { data: products } = await supabase.from('products').select('id').limit(1);

  if (!guides?.length || !products?.length) {
    console.log("Nenhum guia ou produto encontrado! Rode a simulação de E2E primeiro.");
    return;
  }

  const guideId = guides[0].id;
  const productId = products[0].id;

  const viewsToInsert = [];
  const clicksToInsert = [];

  const marketplaces = ['amazon', 'mercadolivre', 'shopee'];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    
    // Aleatório entre 10 e 50 views
    const numViews = Math.floor(Math.random() * 41) + 10;
    for (let v = 0; v < numViews; v++) {
      const viewDate = new Date(d);
      viewDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      viewsToInsert.push({
        guide_id: guideId,
        referer: 'direct',
        user_agent: 'Simulation Bot',
        viewed_at: viewDate.toISOString()
      });
    }

    // Aleatório entre 20 e 100 cliques
    const numClicks = Math.floor(Math.random() * 81) + 20;
    for (let c = 0; c < numClicks; c++) {
      const clickDate = new Date(d);
      clickDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      clicksToInsert.push({
        post_id: guideId,
        platform: marketplaces[Math.floor(Math.random() * marketplaces.length)],
        affiliate_url: 'https://example.com/affiliate',
        created_at: clickDate.toISOString()
      });
    }
  }

  // Insert views
  console.log(`Inserindo ${viewsToInsert.length} views...`);
  const { error: errViews } = await supabase.from('guide_views').insert(viewsToInsert);
  if (errViews) console.error("Erro inserindo views:", errViews.message);

  // Insert clicks
  console.log(`Inserindo ${clicksToInsert.length} clicks...`);
  const { error: errClicks } = await supabase.from('clicks_tracking').insert(clicksToInsert);
  if (errClicks) console.error("Erro inserindo clicks:", errClicks.message);

  console.log("✅ Tráfego retroativo gerado com sucesso!");
}

simulateTraffic();
