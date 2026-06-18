import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

chromium.use(stealth());

async function run() {
    console.log("🚀 Iniciando o modo descoberta com injeção de sessão...");
    
    // Ler cookies
    const cookiesRaw = fs.readFileSync('cookies.json', 'utf8');
    const cookies = JSON.parse(cookiesRaw);

    const browser = await chromium.launch({ headless: true });
    
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport: { width: 1920, height: 1080 }
    });

    // Filtra cookies inválidos para o playwright (ex: sameSite "no_restriction" que o playwright as vezes reclama, converte para 'None')
    const formattedCookies = cookies.map((c: any) => ({
        ...c,
        sameSite: c.sameSite === 'no_restriction' ? 'None' : (c.sameSite === 'unspecified' ? 'Lax' : c.sameSite)
    }));

    await context.addCookies(formattedCookies);

    const page = await context.newPage();

    try {
        console.log("📡 Acessando painel de afiliados...");
        await page.goto('https://www.mercadolivre.com.br/afiliados/linkbuilder#hub', { waitUntil: 'networkidle', timeout: 60000 });
        
        // Aguarda um pouco a mais para renderizar conteúdo assíncrono
        await page.waitForTimeout(5000);

        console.log("📸 Capturando tela e HTML...");
        await page.screenshot({ path: 'debug_painel_afiliados.png' });
        
        const html = await page.content();
        fs.writeFileSync('debug_afiliados.html', html);
        console.log("✅ Dump completo! Verifique debug_painel_afiliados.png e debug_afiliados.html");
    } catch (e) {
        console.error("❌ Erro ao acessar:", e);
        await page.screenshot({ path: 'debug_erro_painel.png' });
    } finally {
        await browser.close();
    }
}

run().catch(console.error);
