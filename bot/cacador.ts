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
    is_viral?: boolean;
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
            await page.waitForTimeout(4000); 

            await page.fill('textarea', urlOriginal);
            await page.click('button:has-text("Gerar")', { timeout: 10000 });
            await page.waitForTimeout(3000); 
            
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
                console.log("🛑 Desistindo após 3 tentativas.");
                throw new Error("Falha definitiva ao gerar link afiliado.");
            }
            console.log(`🔄 Recarregando a página e tentando novamente... (Tentativa ${attempt + 1})`);
            await page.waitForTimeout(2000 * attempt); 
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
        url: "https://lista.mercadolivre.com.br/beleza-cuidado-pessoal/maquiagem/base-corretivo-blush_Deal_ofertas-do-dia"
    },
    {
        categoria: "cabelo_perfume",
        url: "https://lista.mercadolivre.com.br/beleza-cuidado-pessoal/perfumes/_Deal_ofertas-do-dia"
    }
];

async function extrairProdutosDaPagina(page: Page, historico: Set<string>, alvoCategoria: string, isViral: boolean, limite: number): Promise<Oferta[]> {
    const seletoresPossiveis = [".promotion-item", ".poly-card", ".ui-search-layout__item"];
    let elementos: any[] = [];
    for (const seletor of seletoresPossiveis) {
        elementos = await page.$$(seletor);
        if (elementos.length > 0) break;
    }

    if (elementos.length === 0) {
        console.log(`❌ Nenhuma oferta encontrada na tela.`);
        return [];
    }

    const validados: Oferta[] = [];
    
    for (const produto of elementos) {
        if (validados.length >= limite) break;
        
        try {
            const tituloElement = await produto.$(".promotion-item__title, .poly-component__title");
            const titulo = await tituloElement?.innerText() || "";

            if (historico.has(titulo)) {
                console.log(`⏭️ Ignorando [${titulo}]: Já foi caçado hoje.`);
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

                if (precoOriginal <= preco_desconto) continue;

                const descontoPercentual = ((precoOriginal - preco_desconto) / precoOriginal) * 100;

                if (descontoPercentual < 15 || descontoPercentual > 40) continue;

                console.log(`[Anti-Fraude] ✅ Aprovado p/ Carrinho: [${titulo}] com ${descontoPercentual.toFixed(1)}% OFF.`);

                validados.push({
                    title: titulo,
                    original_price: precoOriginal,
                    discount_price: preco_desconto,
                    image_url: imagem_url,
                    store: "Mercado Livre",
                    affiliate_url: "",
                    categoria: alvoCategoria,
                    link_original: link_original,
                    is_viral: isViral
                });
                
                historico.add(titulo); 
            }
        } catch (e) {
            // Ignora card defeituoso
        }
    }
    return validados;
}

async function buscarOfertas() {
    console.log("🚀 Iniciando o Caçador de Ofertas Híbrido (Trends + Estático)...");

    let viraisPorNicho: Record<string, string[]> = {};
    try {
        if (fs.existsSync('viral.json')) {
            viraisPorNicho = JSON.parse(fs.readFileSync('viral.json', 'utf8'));
            console.log("✅ Dados do Google Trends carregados com sucesso.");
        }
    } catch (e) {
        console.error("Erro ao ler viral.json", e);
    }

    let cookies = [];
    try {
        cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
    } catch (e) {
        console.error("❌ Erro ao ler cookies.json. O bot precisa da sessão do ML.");
        return;
    }

    const browser = await chromium.launch({
        headless: true,
        args: ["--disable-blink-features=AutomationControlled"]
    });

    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        viewport: { width: 1920, height: 1080 },
        permissions: ['clipboard-read', 'clipboard-write']
    });

    const formattedCookies = cookies.map((c: any) => ({
        ...c,
        sameSite: c.sameSite === 'no_restriction' ? 'None' : (c.sameSite === 'unspecified' ? 'Lax' : c.sameSite)
    }));

    await context.addCookies(formattedCookies);
    
    const pageCaca = await context.newPage();
    const carrinhoVirtual: Oferta[] = [];
    const historico = carregarHistorico();

    for (const alvo of ALVOS_DE_BUSCA) {
        console.log(`\n======================================`);
        console.log(`📡 FASE 1: Caçando ofertas no nicho: ${alvo.categoria}`);
        console.log(`======================================\n`);
        
        let produtosNesteNicho = 0;
        const virais = viraisPorNicho[alvo.categoria] || [];

        // PLANO A: BUSCA VIRAL
        if (virais.length > 0) {
            for (const termo of virais) {
                if (produtosNesteNicho >= 4) break;
                
                console.log(`\n🔥 Plano A (Viral): Buscando '${termo}'...`);
                const termoFormatado = termo.toLowerCase().replace(/ /g, '-');
                const urlViral = `https://lista.mercadolivre.com.br/beleza-cuidado-pessoal/${termoFormatado}_Deal_ofertas-do-dia`;
                
                try {
                    await pageCaca.goto(urlViral, { timeout: 60000 });
                    await pageCaca.waitForLoadState("networkidle");
                    
                    // Queremos pescar 1 produto validado por cada termo viral
                    const extraidos = await extrairProdutosDaPagina(pageCaca, historico, alvo.categoria, true, 1);
                    if (extraidos.length > 0) {
                        carrinhoVirtual.push(...extraidos);
                        produtosNesteNicho += extraidos.length;
                    } else {
                        console.log(`Nenhuma oferta válida encontrada para o viral '${termo}'.`);
                    }
                } catch (e) {
                    console.log(`Erro ao buscar o viral '${termo}'.`);
                }
            }
        }

        // PLANO B: PREENCHIMENTO ESTÁTICO (Fallback)
        const faltam = 4 - produtosNesteNicho;
        if (faltam > 0) {
            console.log(`\n🛒 Plano B (Estático): Faltam ${faltam} produtos para fechar a prateleira. Buscando ofertas gerais...`);
            try {
                await pageCaca.goto(alvo.url, { timeout: 60000 });
                await pageCaca.waitForLoadState("networkidle");
                
                const extraidos = await extrairProdutosDaPagina(pageCaca, historico, alvo.categoria, false, faltam);
                carrinhoVirtual.push(...extraidos);
                produtosNesteNicho += extraidos.length;
            } catch (e) {
                console.log(`Erro ao buscar ofertas estáticas.`);
            }
        }

        console.log(`\n✅ ${produtosNesteNicho} produtos colocados no carrinho em ${alvo.categoria}.`);
    }
    
    await pageCaca.close();

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
            historico.delete(item.title);
        }
    }
    
    await pageLink.close();
    salvarHistorico(historico);
    await browser.close();
    
    console.log(`\n🏁 Finalizado! ${sucessoTotal} novos produtos enviados para a vitrine hoje.`);
}

buscarOfertas().catch(console.error);
