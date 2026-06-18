import { chromium } from 'playwright-extra';
import type { Page } from 'playwright';
import stealth from 'puppeteer-extra-plugin-stealth';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

chromium.use(stealth());

const SUPABASE_URL = "https://jebfsjdibuqghnnxjcjn.supabase.co/functions/v1/products";
const BOT_API_KEY = process.env.BOT_API_KEY;

interface Oferta {
    title: string;
    original_price: number;
    discount_price: number;
    image_url: string;
    store: string;
    affiliate_url: string;
    categoria?: string;
    link_original?: string;
}

const HISTORICO_PATH = 'historico.json';

function carregarHistorico(): Set<string> {
    try {
        if (fs.existsSync(HISTORICO_PATH)) {
            const data = fs.readFileSync(HISTORICO_PATH, 'utf8');
            return new Set(JSON.parse(data));
        }
    } catch (e) {
        console.error("Erro ao ler historico.json:", e);
    }
    return new Set();
}

function salvarHistorico(historico: Set<string>) {
    try {
        fs.writeFileSync(HISTORICO_PATH, JSON.stringify(Array.from(historico), null, 2), 'utf8');
    } catch (e) {
        console.error("Erro ao salvar historico.json:", e);
    }
}

async function enviarParaSupabase(oferta: Oferta) {
    if (!BOT_API_KEY) {
        console.error("ERRO: BOT_API_KEY não encontrada no .env!");
        return false;
    }

    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
    const headers = {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "x-api-key": BOT_API_KEY,
        "Content-Type": "application/json"
    };

    console.log(`📦 Injetando no banco: ${oferta.title}`);
    try {
        const response = await fetch(SUPABASE_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(oferta)
        });

        if (response.status === 201) {
            console.log("✅ Sucesso ao salvar no banco!");
            return true;
        } else {
            const text = await response.text();
            console.log(`❌ Falha ao salvar: ${response.status} - ${text}`);
            return false;
        }
    } catch (e) {
        console.error("Erro na requisição pro banco:", e);
        return false;
    }
}

async function gerarLinkAfiliado(page: Page, urlOriginal: string): Promise<string> {
    console.log(`🔗 Gerando link afiliado para: ${urlOriginal.substring(0, 50)}...`);
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            await page.goto('https://www.mercadolivre.com.br/afiliados/linkbuilder#hub', { waitUntil: 'networkidle' });
            await page.waitForTimeout(4000); // Aguarda renderizar UI

            await page.fill('textarea', urlOriginal);
            await page.click('button:has-text("Gerar")', { timeout: 10000 });
            await page.waitForTimeout(3000); // Aguarda gerar
            
            await page.click('button:has-text("Copiar")', { timeout: 10000 });
            
            const clipboardText = await page.evaluate(async () => {
                return await navigator.clipboard.readText();
            });

            if (clipboardText.includes("meli.la") || clipboardText.includes("mercadolivre.com")) {
                console.log(`✅ Link gerado (Tentativa ${attempt + 1}): ${clipboardText}`);
                return clipboardText.trim();
            } else {
                throw new Error("Link no clipboard inválido: " + clipboardText);
            }
        } catch (e) {
            attempt++;
            console.error(`❌ Falha na tentativa ${attempt}: ${e instanceof Error ? e.message : 'Timeout'}`);
            if (attempt >= MAX_RETRIES) {
                console.log("🛑 Desistindo após 3 tentativas. O Mercado Livre está muito lento.");
                throw new Error("Falha definitiva ao gerar link afiliado.");
            }
            console.log(`🔄 Recarregando a página e tentando novamente... (Tentativa ${attempt + 1})`);
            await page.waitForTimeout(2000 * attempt); // Delay progressivo
        }
    }
    throw new Error("Falha inexperada");
}

const ALVOS_DE_BUSCA = [
    {
        categoria: "skincare",
        url: "https://lista.mercadolivre.com.br/beleza-cuidado-pessoal/cuidados-pele/_Deal_ofertas-do-dia"
    },
    {
        categoria: "maquiagem",
        url: "https://lista.mercadolivre.com.br/beleza-cuidado-pessoal/maquiagem/_Deal_ofertas-do-dia"
    },
    {
        categoria: "cabelo_perfume",
        url: "https://lista.mercadolivre.com.br/beleza-cuidado-pessoal/perfumes/_Deal_ofertas-do-dia"
    }
];

async function buscarOfertas() {
    console.log("🚀 Iniciando o Caçador de Ofertas com Nichos...");

    let cookies = [];
    try {
        const cookiesRaw = fs.readFileSync('cookies.json', 'utf8');
        cookies = JSON.parse(cookiesRaw);
    } catch (e) {
        console.error("❌ Erro ao ler cookies.json. O bot precisa da sessão do ML.");
        return;
    }

    const browser = await chromium.launch({
        headless: true,
        args: ["--disable-blink-features=AutomationControlled"]
    });

    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport: { width: 1920, height: 1080 },
        permissions: ['clipboard-read', 'clipboard-write']
    });

    const formattedCookies = cookies.map((c: any) => ({
        ...c,
        sameSite: c.sameSite === 'no_restriction' ? 'None' : (c.sameSite === 'unspecified' ? 'Lax' : c.sameSite)
    }));

    await context.addCookies(formattedCookies);
    
    // FASE 1: CAÇA
    const pageCaca = await context.newPage();
    const carrinhoVirtual: Oferta[] = [];
    const historico = carregarHistorico();

    for (const alvo of ALVOS_DE_BUSCA) {
        console.log(`\n======================================`);
        console.log(`📡 FASE 1: Caçando ofertas no nicho: ${alvo.categoria}`);
        console.log(`======================================\n`);
        
        try {
            await pageCaca.goto(alvo.url, { timeout: 60000 });
            await pageCaca.waitForLoadState("networkidle");

            const seletoresPossiveis = [".promotion-item", ".poly-card", ".ui-search-layout__item"];
            let elementos: any[] = [];
            for (const seletor of seletoresPossiveis) {
                elementos = await pageCaca.$$(seletor);
                if (elementos.length > 0) break;
            }

            if (elementos.length === 0) {
                console.log(`❌ Nenhuma oferta encontrada para ${alvo.categoria}. Captcha ou layout diferente?`);
                continue;
            }

            let validosNoNicho = 0;
            
            for (const produto of elementos) {
                if (validosNoNicho >= 4) break; // Garante 4 aprovados por nicho
                
                try {
                    const tituloElement = await produto.$(".promotion-item__title, .poly-component__title");
                    const titulo = await tituloElement?.innerText() || "";

                    if (historico.has(titulo)) {
                        console.log(`⏭️ Ignorando [${titulo}]: Já foi caçado hoje (Ineditismo forçado).`);
                        continue;
                    }

                    const precoElement = await produto.$(".promotion-item__price span.andes-money-amount__fraction, .poly-price__current span.andes-money-amount__fraction");
                    const preco_str = await precoElement?.innerText() || "0";
                    let preco_desconto = parseFloat(preco_str.replace(/\./g, "").replace(",", "."));

                    const linkElement = await produto.$("a.promotion-item__link-container, a.poly-component__title");
                    const link_original = await linkElement?.getAttribute("href") || "";

                    const imagemElement = await produto.$("img.promotion-item__imgs, img.poly-component__picture");
                    const imagem_url = await imagemElement?.getAttribute("src") || "";

                    if (titulo && link_original && preco_desconto > 0) {
                        let precoOriginal = preco_desconto;
                        try {
                            const precoAntigoElement = await produto.$('.andes-money-amount--previous .andes-money-amount__fraction');
                            if (precoAntigoElement) {
                                const textoOriginal = await precoAntigoElement.innerText();
                                precoOriginal = parseFloat(textoOriginal.replace(/\./g, "").replace(",", "."));
                            }
                        } catch (err) { }

                        // Filtro Anti-Fraude
                        if (precoOriginal <= preco_desconto) {
                            console.warn(`[Anti-Fraude] ❌ Reprovado: [${titulo}] não possui preço riscado.`);
                            continue;
                        }

                        const descontoPercentual = ((precoOriginal - preco_desconto) / precoOriginal) * 100;

                        // Regra de Negócio: 15% a 40%
                        if (descontoPercentual < 15 || descontoPercentual > 40) {
                            console.warn(`[Anti-Fraude] ❌ Reprovado: [${titulo}] tem ${descontoPercentual.toFixed(1)}% OFF (fora da margem).`);
                            continue;
                        }

                        console.log(`[Anti-Fraude] ✅ Aprovado p/ Carrinho: [${titulo}] com ${descontoPercentual.toFixed(1)}% OFF.`);

                        carrinhoVirtual.push({
                            title: titulo,
                            original_price: precoOriginal,
                            discount_price: preco_desconto,
                            image_url: imagem_url,
                            store: "Mercado Livre",
                            affiliate_url: "", // Gerado na Fase 2
                            categoria: alvo.categoria,
                            link_original: link_original
                        });
                        
                        validosNoNicho++;
                        historico.add(titulo); // Já marca como lido para a memória local
                    }
                } catch (e) {
                    console.log("Aviso: Falha ao extrair card de produto.");
                }
            }

            console.log(`🛒 ${validosNoNicho} produtos colocados no carrinho em ${alvo.categoria}.`);

        } catch (e) {
            console.error(`Erro ao processar o nicho ${alvo.categoria}:`, e);
        }
    }
    
    await pageCaca.close(); // Fecha a aba de caça para não consumir RAM

    // FASE 2: CONVERSÃO (O Linkbuilder)
    console.log(`\n======================================`);
    console.log(`⚙️ FASE 2: Convertendo os ${carrinhoVirtual.length} produtos do carrinho...`);
    console.log(`======================================\n`);
    
    const pageLink = await context.newPage();

    let sucessoTotal = 0;
    for (const item of carrinhoVirtual) {
        if (!item.link_original) continue;

        try {
            const shortLink = await gerarLinkAfiliado(pageLink, item.link_original);
            item.affiliate_url = shortLink;
            
            const salvoOk = await enviarParaSupabase(item);
            if (salvoOk) sucessoTotal++;
            
        } catch (e) {
            console.log(`⚠️ Falhou a geração para [${item.title}]. Pulando.`);
            historico.delete(item.title); // Remove do histórico para tentar amanhã se falhou
        }
    }
    
    await pageLink.close();

    // Salva o histórico em disco
    salvarHistorico(historico);

    await browser.close();
    console.log(`\n🏁 Finalizado! ${sucessoTotal} novos produtos enviados para a vitrine hoje.`);
}

buscarOfertas().catch(console.error);
