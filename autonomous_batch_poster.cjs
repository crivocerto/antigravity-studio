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

async function generateDynamicBatch() {
  console.log("🤖 Solicitando Geração de Conteúdo Inédito ao Gemini 3.5 Flash (Proxy Local)...");
  
  // Nichos aleatórios para variedade
  const nichos = ["eletronicos", "casa-jardim", "saude-beleza", "pets", "software", "games", "cozinha", "ferramentas"];
  const personas = ["custo-beneficio", "premium", "iniciantes", "profissionais", "praticidade", "durabilidade"];
  
  const nichoEscolhido = nichos[Math.floor(Math.random() * nichos.length)];
  const personaEscolhida = personas[Math.floor(Math.random() * personas.length)];
  
  const prompt = `Você é um curador especialista do CrivoCerto.
Gere um NOVO guia de review de produtos, focado em:
Categoria (category_slug): ${nichoEscolhido}
Persona (persona_slug): ${personaEscolhida}

Você deve gerar um JSON ESTRITO E VÁLIDO com a seguinte estrutura:
{
  "batches": [
    {
      "guide": {
        "category_slug": "${nichoEscolhido}",
        "persona_slug": "${personaEscolhida}",
        "context_slug": "melhores-[produto]-[ano]",
        "url_path": "/guias/${nichoEscolhido}/${personaEscolhida}/melhores-[produto]-[ano]",
        "headline": "Top 3 [Produto] para [Persona] em 2026",
        "intro_text": "Sua introdução de 2 frases chamativas."
      },
      "products": [
        {
          "name": "Nome Real do Produto 1",
          "slug": "slug-produto-1",
          "category_slug": "${nichoEscolhido}",
          "brand": "Marca",
          "spec_summary": "Resumo de especificações em 1 frase",
          "pros": ["Pro 1", "Pro 2"],
          "cons": ["Contra 1"],
          "hero_image": "URL de imagem (ex: https://images.unsplash.com/photo-123...)",
          "affiliate_links": [{ "platform": "amazon", "url": "https://amazon.com.br", "price": 1000 }],
          "pitch": "Frase de venda do produto",
          "rank": 1
        },
        // Gere exatamente 3 produtos, rank de 1 a 3
      ]
    }
  ]
}

REGRAS:
1. Retorne APENAS o JSON, sem \`\`\`json ou texto extra.
2. Certifique-se que as URLs de imagens do Unsplash são genéricas ou use um id real.
3. Não use o mesmo produto dos guias de fones de ouvido ou aspiradores robô. Inove no produto (ex: cadeira gamer, monitor ultrawide, air fryer, liquidificador, ração super premium, smartwatch).
4. O campo 'url_path' não deve existir ainda no banco de dados. Crie um context_slug bem específico.`;

  try {
    const res = await fetch('http://127.0.0.1:8787/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9 // Alta temperatura para variedade criativa
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    let content = data.choices[0].message.content.trim();
    
    // Clean up markdown se a IA colocar
    if (content.startsWith('```json')) content = content.replace('```json', '');
    if (content.startsWith('```')) content = content.replace('```', '');
    if (content.endsWith('```')) content = content.substring(0, content.length - 3);
    
    const parsed = JSON.parse(content.trim());
    return parsed.batches;
  } catch (err) {
    console.error("Erro ao gerar batch via IA:", err.message);
    process.exit(1);
  }
}

async function runAutonomousPoster() {
  console.log("🤖 INICIANDO HERMES AUTONOMOUS POSTER BATCH (IA DINÂMICA)...");
  
  const batches = await generateDynamicBatch();
  
  for (const batch of batches) {
    console.log(`\n\n📝 Iniciando Pesquisa e Postagem: [${batch.guide.headline}]`);
    
    // Log Agent Job Start
    const jobRes = await sendRequest({
      action: "log_job",
      payload: { task: `Gerando e montando review IA: ${batch.guide.headline}` },
      status: "running"
    });
    const jobId = jobRes.data?.id;

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
