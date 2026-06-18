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
    try {
        await page.goto('https://www.mercadolivre.com.br/afiliados/linkbuilder#hub', { waitUntil: 'networkidle' });
        await page.waitForTimeout(4000); // Aguarda renderizar UI

        await page.fill('textarea', urlOriginal);
        await page.click('button:has-text("Gerar")');
        await page.waitForTimeout(3000); // Aguarda gerar
        
        await page.click('button:has-text("Copiar")');
        
        const clipboardText = await page.evaluate(async () => {
            return await navigator.clipboard.readText();
        });

        if (clipboardText.includes("meli.la") || clipboardText.includes("mercadolivre.com")) {
            console.log(`✅ Link gerado: ${clipboardText}`);
            return clipboardText.trim();
        } else {
            console.log("⚠️ Link inválido no clipboard:", clipboardText);
            return urlOriginal;
        }

    } catch (e) {
        console.error("❌ Erro ao gerar link:", e);
        return urlOriginal; // Fallback
    }
}

const ALVOS_DE_BUSCA = [
    {
        categoria: "skincare",
        url: "https://www.mercadolivre.com.br/ofertas?category=MLB1246#origin=discount_hub&deal_print_id=2284b390-d0f9-11ee-b88a-3507c9b0e1b6&c_id=special-normal"
    },
    {
        categoria: "maquiagem",
        url: "https://lista.mercadolivre.com.br/beleza-cuidado-pessoal/maquiagem/_Deal_ofertas-do-dia"
    },
    {
        categoria: "cabelo_perfume",
        url: "https://www.mercadolivre.com.br/ofertas?category=MLB1248#origin=discount_hub&deal_print_id=2284b390-d0f9-11ee-b88a-3507c9b0e1b6&c_id=special-normal"
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
            let elementos = [];
            for (const seletor of seletoresPossiveis) {
                elementos = await page.$$(seletor);
                if (elementos.length > 0) break;
            }

            if (elementos.length === 0) {
                console.log(`❌ Nenhuma oferta encontrada para ${alvo.categoria}. Captcha ou layout diferente?`);
                continue;
            }

            const produtosExtraidos = [];
            
            for (const produto of elementos.slice(0, 2)) { // Limita a 2 por nicho pra não demorar
                try {
                    const tituloElement = await produto.$(".promotion-item__title, .poly-component__title");
                    const titulo = await tituloElement?.innerText() || "";

                    const precoElement = await produto.$(".promotion-item__price span.andes-money-amount__fraction, .poly-price__current span.andes-money-amount__fraction");
                    const preco_str = await precoElement?.innerText() || "0";
                    const preco_desconto = parseFloat(preco_str.replace(/\./g, "").replace(",", "."));

                    const linkElement = await produto.$("a.promotion-item__link-container, a.poly-component__title");
                    const link_original = await linkElement?.getAttribute("href") || "";

                    const imagemElement = await produto.$("img.promotion-item__imgs, img.poly-component__picture");
                    const imagem_url = await imagemElement?.getAttribute("src") || "";

                    if (titulo && link_original && preco_desconto > 0) {
                        produtosExtraidos.push({
                            title: titulo,
                            original_price: parseFloat((preco_desconto * 1.3).toFixed(2)),
                            discount_price: preco_desconto,
                            image_url: imagem_url,
                            store: "Mercado Livre",
                            affiliate_url: link_original,
                            categoria: alvo.categoria
                        });
                    }
                } catch (e) {
                    console.log("Aviso: Falha ao extrair card de produto.", e);
                }
            }

            console.log(`🎯 ${produtosExtraidos.length} produtos extraídos em ${alvo.categoria}. Convertendo links...`);

            for (const p of produtosExtraidos) {
                const shortLink = await gerarLinkAfiliado(page, p.affiliate_url);
                p.affiliate_url = shortLink;
                await enviarParaSupabase(p as any);
            }

        } catch (e) {
            console.error(`Erro ao processar o nicho ${alvo.categoria}:`, e);
        }
    }

    await browser.close();
    console.log("\n🏁 Finalizado todos os nichos.");
}

buscarOfertas().catch(console.error);
