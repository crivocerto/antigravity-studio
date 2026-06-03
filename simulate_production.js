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
  const product1 = {
    name: "Samsung Smart TV 55 QLED 4K Q65D 2024",
    slug: "samsung-smart-tv-55-qled-4k-q65d-2024",
    category_slug: "smart-tvs",
    brand: "Samsung",
    spec_summary: "55 polegadas, QLED 4K, Processador Quantum Lite 4K, Tizen, Alexa integrada",
    pros: ["Cores vivas com QLED", "Design ultrafino", "Sistema rápido"],
    cons: ["Áudio nativo fraco", "Ângulo de visão limitado"],
    affiliate_links: [
      { platform: "amazon", url: "https://amazon.com.br/dp/B001", price: 3200 },
      { platform: "mercadolivre", url: "https://produto.mercadolivre.com.br/MLB-101", price: 3100 }
    ],
    hero_image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80"
  };

  const product2 = {
    name: "LG OLED evo C4 55 4K",
    slug: "lg-oled-evo-c4-55-4k",
    category_slug: "smart-tvs",
    brand: "LG",
    spec_summary: "55 polegadas, OLED evo, 144Hz, Processador Alpha 9 Gen 7",
    pros: ["Contraste infinito", "Perfeita para games (144Hz)", "WebOS fluido"],
    cons: ["Preço elevado", "Risco de burn-in a longo prazo"],
    affiliate_links: [
      { platform: "amazon", url: "https://amazon.com.br/dp/B002", price: 5800 },
      { platform: "shopee", url: "https://shopee.com.br/product/202", price: 5750 }
    ],
    hero_image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80"
  };

  const product3 = {
    name: "TCL QLED TV 55 C645 4K",
    slug: "tcl-qled-tv-55-c645-4k",
    category_slug: "smart-tvs",
    brand: "TCL",
    spec_summary: "55 polegadas, QLED, Google TV, Dolby Vision",
    pros: ["Melhor custo-benefício", "Google TV muito versátil", "Painel QLED barato"],
    cons: ["Brilho máximo mediano", "Design mais simples"],
    affiliate_links: [
      { platform: "mercadolivre", url: "https://produto.mercadolivre.com.br/MLB-303", price: 2400 }
    ],
    hero_image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80"
  };

  const products = [product1, product2, product3];

  const productIds = [];
  console.log("Inserindo Produto 1...");
  for (const p of products) {
    const res = await sendRequest({ action: "upsert_product", payload: p });
    if (res.data?.id) productIds.push(res.data.id);
  }

  // 3. Inserir o Guia
  const guideRes = await sendRequest({
    action: "insert_guide",
    payload: {
      category_slug: "smart-tvs",
      persona_slug: "cinematograficos",
      context_slug: "melhores-tvs-oled-2026",
      url_path: "/guias/smart-tvs/cinematograficos/melhores-tvs-oled-2026",
      headline: "As 3 Melhores Smart TVs OLED e Premium de 2026",
      intro_text: "Testamos a nova geração de TVs 4K com IA integrada. De QLEDs acessíveis a painéis OLED Evo, descubra qual é o melhor investimento para sua sala."
    }
  });
  const guideId = guideRes.data?.id;

  // 4. Linkar os Produtos ao Guia
  if (guideId && productIds.length === 3) {
    await sendRequest({
      action: "link_product_to_guide",
      payload: { guide_id: guideId, product_id: productIds[0], rank_position: 1, contextual_pitch: "A Samsung acertou em cheio no processamento de IA. Upscaling brilhante e cores incríveis por um preço justo." }
    });
    await sendRequest({
      action: "link_product_to_guide",
      payload: { guide_id: guideId, product_id: productIds[1], rank_position: 2, contextual_pitch: "Para quem quer os pretos absolutos do OLED. Se dinheiro não é problema e você joga videogame, essa é a escolha ideal." }
    });
    await sendRequest({
      action: "link_product_to_guide",
      payload: { guide_id: guideId, product_id: productIds[2], rank_position: 3, contextual_pitch: "Campeã do custo-benefício. Painel QLED com Google TV embarcado pelo preço de uma TV básica da concorrência." }
    });
  }

  // 5. Log Success Job
  await sendRequest({
    action: "log_job",
    payload: { task: "pesquisando top 3 smart tvs" },
    status: "success",
    metadata: { task: "pesquisando top 3 smart tvs", items_processed: 3 }
  });

  console.log("✅ Simulação concluída com sucesso!");
}

simulate();
