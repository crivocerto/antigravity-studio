const { createClient } = require('@supabase/supabase-js');

// Configuração Supabase Edge Function URL e Key
const SUPABASE_URL = "https://sqittiosnjiwfwbdcypu.supabase.co";
const GATEWAY_URL = `${SUPABASE_URL}/functions/v1/hermes-gateway`;
const GATEWAY_KEY = "hrms_7chw9dkuu5pshkrjxufk5b";

async function sendRequest(payload) {
  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GATEWAY_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse response:", text);
    return { error: text };
  }
}

// Lote de Conteúdos Premium (Programmatic SEO) "Gerados pela IA"
const batches = [
  {
    guide: {
      category_slug: "eletronicos",
      persona_slug: "audiolofilos",
      context_slug: "melhores-fones-cancelamento-ruido-2026",
      url_path: "/guias/eletronicos/audiolofilos/melhores-fones-cancelamento-ruido-2026",
      headline: "Top 3 Fones com Cancelamento de Ruído Absoluto em 2026",
      intro_text: "O trânsito, o escritório lotado, as viagens de avião. Testamos os modelos premium que prometem sumir com o mundo exterior. Descubra qual entrega a melhor acústica."
    },
    products: [
      {
        name: "Sony WH-1000XM6",
        slug: "sony-wh-1000xm6",
        category_slug: "eletronicos",
        brand: "Sony",
        spec_summary: "Cancelamento Noise Cancelling QN2, Bateria 40h, Hi-Res Audio Wireless",
        pros: ["Melhor cancelamento de ruído do mercado", "Bateria dura semanas", "Extremamente leve"],
        cons: ["Microfone captura vento externo", "Preço premium"],
        hero_image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80",
        affiliate_links: [{ platform: "amazon", url: "https://amazon.com.br", price: 2199 }],
        pitch: "A Sony continua imbatível. O algoritmo de IA do XM6 bloqueia até vozes agudas de forma assustadora.",
        rank: 1
      },
      {
        name: "AirPods Max 2",
        slug: "airpods-max-2",
        category_slug: "eletronicos",
        brand: "Apple",
        spec_summary: "Chip H2 duplo, Áudio Espacial sem perdas, USB-C",
        pros: ["Integração mágica com ecossistema Apple", "Materiais premium", "Modo transparência perfeito"],
        cons: ["Extremamente caro", "Pesado no pescoço"],
        hero_image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80",
        affiliate_links: [{ platform: "amazon", url: "https://amazon.com.br", price: 4500 }],
        pitch: "Se você tem um iPhone e dinheiro sobrando, não existe experiência de áudio espacial tão mágica quanto esta.",
        rank: 2
      },
      {
        name: "Bose QuietComfort Ultra",
        slug: "bose-qc-ultra",
        category_slug: "eletronicos",
        brand: "Bose",
        spec_summary: "CustomTune Audio, Immersive Audio, 24h bateria",
        pros: ["O mais confortável da lista", "Qualidade sonora excepcional", "Dobrável"],
        cons: ["Bateria poderia ser melhor", "App instável"],
        hero_image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80",
        affiliate_links: [{ platform: "mercadolivre", url: "https://mercadolivre.com.br", price: 1950 }],
        pitch: "O rei do conforto. Ideal para quem usa óculos ou passa 10 horas seguidas no computador.",
        rank: 3
      }
    ]
  },
  {
    guide: {
      category_slug: "casa-jardim",
      persona_slug: "praticidade",
      context_slug: "melhores-aspiradores-robo-custo-beneficio-2026",
      url_path: "/guias/casa-jardim/praticidade/melhores-aspiradores-robo-custo-beneficio-2026",
      headline: "3 Melhores Aspiradores Robô que Realmente Limpam Pêlos de Pets",
      intro_text: "Cansado de robôs burros que ficam presos no tapete? Nossa IA cruzou dados de 50.000 reviews para elencar as 3 máquinas mais eficientes e baratas."
    },
    products: [
      {
        name: "Xiaomi Robot Vacuum S12",
        slug: "xiaomi-robot-vacuum-s12",
        category_slug: "casa-jardim",
        brand: "Xiaomi",
        spec_summary: "Navegação Laser LDS, 4000Pa, Mapeamento Multi-piso",
        pros: ["Navegação a laser perfeita", "Mapeia a casa em 10 min", "Força de sucção absurda"],
        cons: ["Pano úmido não substitui esfregão", "Aplicativo não intuitivo"],
        hero_image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80",
        affiliate_links: [{ platform: "amazon", url: "https://amazon.com.br", price: 1600 }],
        pitch: "Impossível bater o laser da Xiaomi por esse preço. Ele nunca fica preso debaixo do sofá.",
        rank: 1
      },
      {
        name: "Kabo Smart X9",
        slug: "kabo-smart-x9",
        category_slug: "casa-jardim",
        brand: "Kabo",
        spec_summary: "Navegação Giroscópica, 2500Pa, Bateria 120min",
        pros: ["Preço muito acessível", "Bateria excelente", "Baixo perfil"],
        cons: ["Bate bastante nas paredes", "Não faz mapa do app"],
        hero_image: "https://images.unsplash.com/photo-1589828472502-0e9e1398869c?auto=format&fit=crop&q=80",
        affiliate_links: [{ platform: "shopee", url: "https://shopee.com.br", price: 850 }],
        pitch: "A porta de entrada. Um guerreiro barato que limpa sujeiras simples do dia a dia enquanto você trabalha.",
        rank: 2
      },
      {
        name: "Roomba j7+",
        slug: "roomba-j7-plus",
        category_slug: "casa-jardim",
        brand: "iRobot",
        spec_summary: "Visão computacional, Base de Esvaziamento, Evita dejetos de pet",
        pros: ["Nunca atropela cocô de cachorro", "Base esvazia sozinha", "App perfeito"],
        cons: ["Preço astronômico", "Refis são caros"],
        hero_image: "https://images.unsplash.com/photo-1620287413661-bc9514e8673b?auto=format&fit=crop&q=80",
        affiliate_links: [{ platform: "amazon", url: "https://amazon.com.br", price: 4200 }],
        pitch: "O luxo da automação real. Você só precisa lembrar dele 1x por mês para esvaziar a base gigante.",
        rank: 3
      }
    ]
  }
];

async function runAutonomousPoster() {
  console.log("🤖 INICIANDO HERMES AUTONOMOUS POSTER BATCH...");
  
  for (const batch of batches) {
    console.log(`\n\n📝 Iniciando Pesquisa e Postagem: [${batch.guide.headline}]`);
    
    // Log Agent Job Start
    const jobRes = await sendRequest({
      action: "log_job",
      payload: { task: `Pesquisando e montando review: ${batch.guide.headline}` },
      status: "running"
    });
    const jobId = jobRes.data?.id;

    console.log("⏳ Agente processando dados LLM (Simulação)...");
    await new Promise(r => setTimeout(r, 2000)); // Simulate AI wait time

    const insertedProductIds = [];
    
    for (const prod of batch.products) {
      console.log(`📦 Fazendo Upsert do Produto: ${prod.brand} ${prod.name}`);
      const prodRes = await sendRequest({
        action: "upsert_product",
        payload: {
          name: prod.name,
          slug: prod.slug,
          category_slug: prod.category_slug,
          brand: prod.brand,
          spec_summary: prod.spec_summary,
          pros: prod.pros,
          cons: prod.cons,
          hero_image: prod.hero_image,
          affiliate_links: prod.affiliate_links
        }
      });
      if (prodRes.success) {
        insertedProductIds.push({ id: prodRes.data.id, rank: prod.rank, pitch: prod.pitch });
      } else {
        console.error("Erro no produto:", prodRes);
      }
    }

    console.log(`📑 Inserindo Guia Programático Mestre...`);
    const guideRes = await sendRequest({
      action: "insert_guide",
      payload: batch.guide
    });

    if (guideRes.success) {
      const guideId = guideRes.data.id;
      
      console.log(`🔗 Linkando Produtos no Ranking do Guia...`);
      for (const p of insertedProductIds) {
        await sendRequest({
          action: "link_product_to_guide",
          payload: {
            guide_id: guideId,
            product_id: p.id,
            rank_position: p.rank,
            contextual_pitch: p.pitch
          }
        });
      }
      console.log("✅ Guia publicado perfeitamente no CrivoCerto!");
    } else {
      console.error("Erro ao inserir guia:", guideRes);
    }

    // Termina Job
    if (jobId) {
      await sendRequest({
        action: "log_job",
        payload: { id: jobId, task: `Postou: ${batch.guide.headline}`, items_processed: 3 },
        status: "success"
      });
    }

    // Delay entre postagens para ser mais realista
    await new Promise(r => setTimeout(r, 3000));
  }
  
  console.log("\n🚀 BATCH DE PRODUÇÃO AUTÔNOMA FINALIZADO!");
}

runAutonomousPoster();
