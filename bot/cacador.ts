import { chromium } from 'playwright-extra';
import type { Page } from 'playwright';
import stealth from 'puppeteer-extra-plugin-stealth';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { validarDescontoReal } from './price_validator.js';

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
}

async function enviarParaSupabase(oferta: Oferta) {
    if (!BOT_API_KEY) {
        console.error("ERRO: BOT_API_KEY não encontrada no .env!");
        return;
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
        } else {
            const text = await response.text();
            console.log(`❌ Falha ao salvar: ${response.status} - ${text}`);
        }
    } catch (e) {
        console.error("Erro na requisição pro banco:", e);
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
    const page = await context.newPage();

    for (const alvo of ALVOS_DE_BUSCA) {
        console.log(`\n======================================`);
        console.log(`📡 Caçando ofertas no nicho: ${alvo.categoria}`);
        console.log(`======================================\n`);
        
        try {
            await page.goto(alvo.url, { timeout: 60000 });
            await page.waitForLoadState("networkidle");

            const seletoresPossiveis = [".promotion-item", ".poly-card", ".ui-search-layout__item"];
            let elementos: any[] = [];
            for (const seletor of seletoresPossiveis) {
                elementos = await page.$$(seletor);
                if (elementos.length > 0) break;
            }

            if (elementos.length === 0) {
                console.log(`❌ Nenhuma oferta encontrada para ${alvo.categoria}. Captcha ou layout diferente?`);
                continue;
            }

            const produtosExtraidos = [];
            let sucessosNoNicho = 0;
            
            for (const produto of elementos) {
                if (sucessosNoNicho >= 4) break; // Limita a 4 por nicho pra vitrine ficar mais cheia
                
                try {
                    const tituloElement = await produto.$(".promotion-item__title, .poly-component__title");
                    const titulo = await tituloElement?.innerText() || "";

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
                        } catch (err) {
                            // ignora e usa o mesmo preço (sem desconto visual)
                        }

                        // 1. Passa pelo "Filtro de Ouro" (Anti-Fraude API)
                        const auditoriaDePreco = await validarDescontoReal(link_original);

                        // 2. Se for falso desconto, pula pro próximo produto
                        if (!auditoriaDePreco) {
                            continue; 
                        }

                        // 3. Se for desconto real, usa os preços validados da API Oficial
                        precoOriginal = auditoriaDePreco.preco_antigo;
                        preco_desconto = auditoriaDePreco.preco_atual;

                        // Tentativa de gerar o link afiliado COM BACKOFF
                        let shortLink = "";
                        try {
                            shortLink = await gerarLinkAfiliado(page, link_original);
                        } catch (e) {
                            console.log(`⚠️ Ignorando produto [${titulo}] pois falhou a geração do link afiliado.`);
                            continue; // Pula para a próxima oferta se falhar
                        }

                        const ofertaFinal = {
                            title: titulo,
                            original_price: precoOriginal,
                            discount_price: preco_desconto,
                            image_url: imagem_url,
                            store: "Mercado Livre",
                            affiliate_url: shortLink,
                            categoria: alvo.categoria
                        };

                        produtosExtraidos.push(ofertaFinal);
                        await enviarParaSupabase(ofertaFinal as any);
                        sucessosNoNicho++;
                    }
                } catch (e) {
                    console.log("Aviso: Falha ao extrair card de produto.", e);
                }
            }

            console.log(`🎯 ${sucessosNoNicho} produtos garantidos em ${alvo.categoria}.`);

        } catch (e) {
            console.error(`Erro ao processar o nicho ${alvo.categoria}:`, e);
        }
    }

    await browser.close();
    console.log("\n🏁 Finalizado todos os nichos.");
}

buscarOfertas().catch(console.error);
