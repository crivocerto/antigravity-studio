import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Apply stealth plugin
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

    const headers = {
        "Authorization": `Bearer ${BOT_API_KEY}`,
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
            console.log("✅ Sucesso!");
        } else {
            const text = await response.text();
            console.log(`❌ Falha: ${response.status} - ${text}`);
        }
    } catch (e) {
        console.error("Erro na requisição:", e);
    }
}

async function buscarOfertas() {
    console.log("🚀 Iniciando o Caçador de Ofertas (Modo Stealth Node.js)...");

    const browser = await chromium.launch({
        headless: true,
        args: ["--disable-blink-features=AutomationControlled"]
    });

    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();

    const urlAlvo = "https://www.mercadolivre.com.br/ofertas?category=MLB1246#origin=discount_hub&deal_print_id=2284b390-d0f9-11ee-b88a-3507c9b0e1b6&c_id=special-normal";

    console.log(`📡 Acessando: ${urlAlvo}`);
    
    try {
        await page.goto(urlAlvo, { timeout: 60000 });
        await page.waitForLoadState("networkidle");

        await page.screenshot({ path: "debug_ml.png" });
        console.log("📸 Screenshot salvo como 'debug_ml.png'. Verifique a imagem!");

        const seletoresPossiveis = [".promotion-item", ".poly-card", ".ui-search-layout__item"];
        let produtos = [];
        let seletorEncontrado = "";

        for (const seletor of seletoresPossiveis) {
            produtos = await page.$$(seletor);
            if (produtos.length > 0) {
                console.log(`✅ Elementos encontrados usando o seletor: ${seletor}`);
                seletorEncontrado = seletor;
                break;
            }
        }

        if (produtos.length === 0) {
            console.log("❌ Nenhum produto encontrado. O HTML mudou ou caímos no Captcha. Olhe a imagem debug_ml.png");
            await browser.close();
            return;
        }

        for (const produto of produtos.slice(0, 3)) {
            try {
                // Seletores genéricos adaptáveis (tentando abranger os antigos e novos layouts do ML)
                const tituloElement = await produto.$(".promotion-item__title, .poly-component__title");
                const titulo = await tituloElement?.innerText() || "";

                const precoElement = await produto.$(".promotion-item__price span.andes-money-amount__fraction, .poly-price__current span.andes-money-amount__fraction");
                const preco_str = await precoElement?.innerText() || "0";
                const preco_desconto = parseFloat(preco_str.replace(/\./g, "").replace(",", "."));

                const linkElement = await produto.$("a.promotion-item__link-container, a.poly-component__title");
                const link_original = await linkElement?.getAttribute("href") || "";

                const imagemElement = await produto.$("img.promotion-item__imgs, img.poly-component__picture");
                const imagem_url = await imagemElement?.getAttribute("src") || "";

                const oferta: Oferta = {
                    title: titulo,
                    original_price: parseFloat((preco_desconto * 1.3).toFixed(2)),
                    discount_price: preco_desconto,
                    image_url: imagem_url,
                    store: "Mercado Livre",
                    affiliate_url: link_original
                };

                await enviarParaSupabase(oferta);

            } catch (e) {
                console.error(`Erro ao extrair produto:`, e);
            }
        }

    } catch (e) {
        console.error(`Erro crítico durante a raspagem:`, e);
        await page.screenshot({ path: "debug_error.png" });
    }

    await browser.close();
}

buscarOfertas().catch(console.error);
