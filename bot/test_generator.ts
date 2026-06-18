import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

chromium.use(stealth());

async function run() {
    const cookiesRaw = fs.readFileSync('cookies.json', 'utf8');
    const cookies = JSON.parse(cookiesRaw);

    const browser = await chromium.launch({ headless: true });
    
    // Concede permissão de clipboard para ler a área de transferência
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

    try {
        console.log("📡 Acessando painel de afiliados...");
        await page.goto('https://www.mercadolivre.com.br/afiliados/linkbuilder#hub', { waitUntil: 'networkidle' });
        
        console.log("⏳ Aguardando renderização do formulário...");
        await page.waitForTimeout(5000); 

        const urlTeste = 'https://www.mercadolivre.com.br/perfume-masculino-arabe-salvo-intense-100ml-original-c-nf/up/MLBU3392665458';
        console.log(`✍️ Preenchendo a URL orgânica: ${urlTeste}`);
        
        await page.fill('textarea', urlTeste);

        console.log("🖱️ Clicando em Gerar...");
        await page.click('button:has-text("Gerar")');

        console.log("⏳ Aguardando resultado (5s)...");
        await page.waitForTimeout(5000);
        
        console.log("🖱️ Clicando em Copiar...");
        await page.click('button:has-text("Copiar")');

        console.log("📋 Lendo área de transferência...");
        const clipboardText = await page.evaluate(async () => {
            return await navigator.clipboard.readText();
        });

        console.log(`✅ SUCESSO! Link extraído do clipboard: ${clipboardText}`);
        
    } catch (e) {
        console.error("❌ Erro:", e);
        await page.screenshot({ path: 'debug_generator_error.png' });
    } finally {
        await browser.close();
    }
}

run().catch(console.error);
