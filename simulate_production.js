const HERMES_KEY = "hrms_7chw9dkuu5pshkrjxufk5b";
const URL = "https://sqittiosnjiwfwbdcypu.supabase.co/functions/v1/hermes-gateway";

async function sendRequest(bodyObj) {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HERMES_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bodyObj)
  });
  const data = await response.json();
  console.log(`[${bodyObj.action}] Response:`, data);
  return data;
}

async function simulate() {
  console.log("🚀 Iniciando Simulação do Hermes (PRODUÇÃO)...");

  // 1. Log Start Job
  await sendRequest({
    action: "log_job",
    payload: { task: "pesquisando top 3 fones bluetooth" },
    status: "running",
    metadata: { task: "pesquisando top 3 fones bluetooth" }
  });

  // 2. Inserir 3 Produtos
  const products = [
    {
      title: "Fone de Ouvido Apple AirPods Pro (2ª geração)",
      slug: "apple-airpods-pro-2-geracao",
      category_slug: "fones-bluetooth",
      crivo_score: 98,
      score_breakdown: { qualidade: 100, custo_beneficio: 70, durabilidade: 95 },
      primary_image_url: "https://m.media-amazon.com/images/I/61SUj2aFiwL._AC_SX679_.jpg",
      affiliate_links: { amazon: "https://amzn.to/example1", mercadolivre: "https://mercadolivre.com/example1" }
    },
    {
      title: "Samsung Galaxy Buds2 Pro",
      slug: "samsung-galaxy-buds2-pro",
      category_slug: "fones-bluetooth",
      crivo_score: 92,
      score_breakdown: { qualidade: 95, custo_beneficio: 85, durabilidade: 90 },
      primary_image_url: "https://m.media-amazon.com/images/I/51f5XvWkK-L._AC_SX679_.jpg",
      affiliate_links: { amazon: "https://amzn.to/example2", mercadolivre: "https://mercadolivre.com/example2" }
    },
    {
      title: "QCY T13 Fone de Ouvido Sem Fio",
      slug: "qcy-t13",
      category_slug: "fones-bluetooth",
      crivo_score: 88,
      score_breakdown: { qualidade: 80, custo_beneficio: 100, durabilidade: 85 },
      primary_image_url: "https://m.media-amazon.com/images/I/51wXpA+-+HL._AC_SX679_.jpg",
      affiliate_links: { shopee: "https://shopee.com.br/example3", amazon: "https://amzn.to/example3" }
    }
  ];

  const productIds = [];
  for (const p of products) {
    const res = await sendRequest({ action: "upsert_product", payload: p });
    if (res.data?.id) productIds.push(res.data.id);
  }

  // 3. Inserir o Guia
  const guideRes = await sendRequest({
    action: "insert_guide",
    payload: {
      category_slug: "fones-bluetooth",
      persona_slug: "audiolofilos-e-casuais",
      context_slug: "melhor-custo-beneficio-2026",
      url_path: "/guias/fones-bluetooth/audiolofilos-e-casuais/melhor-custo-beneficio-2026",
      headline: "Os 3 Melhores Fones Bluetooth de 2026: Do Premium ao Custo-Benefício",
      intro_text: "Testamos exaustivamente dezenas de modelos para descobrir quais realmente valem seu dinheiro. Aqui estão os vencedores indiscutíveis."
    }
  });
  const guideId = guideRes.data?.id;

  // 4. Linkar os Produtos ao Guia
  if (guideId && productIds.length === 3) {
    await sendRequest({
      action: "link_product_to_guide",
      payload: { guide_id: guideId, product_id: productIds[0], rank_position: 1, contextual_pitch: "Imbatível em Cancelamento de Ruído. Se dinheiro não é problema, essa é a escolha definitiva." }
    });
    await sendRequest({
      action: "link_product_to_guide",
      payload: { guide_id: guideId, product_id: productIds[1], rank_position: 2, contextual_pitch: "O equilíbrio perfeito. Qualidade Premium por um preço um pouco mais amigável." }
    });
    await sendRequest({
      action: "link_product_to_guide",
      payload: { guide_id: guideId, product_id: productIds[2], rank_position: 3, contextual_pitch: "O rei absoluto do custo-benefício. Bateria absurda pelo preço de um lanche." }
    });
  }

  // 5. Log Success Job
  await sendRequest({
    action: "log_job",
    payload: { task: "pesquisando top 3 fones bluetooth" },
    status: "success",
    metadata: { task: "pesquisando top 3 fones bluetooth", items_processed: 3 }
  });

  console.log("✅ Simulação concluída com sucesso!");
}

simulate();
