import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

chromium.use(stealth());

async function run() {
    const cookiesRaw = fs.readFileSync('cookies.json', 'utf8');
    const cookies = JSON.parse(cookiesRaw);

    const browser = await chromium.launch({ headless: true });
    
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport: { width: 1920, height: 1080 }
    });

    const formattedCookies = cookies.map((c: any) => ({
        ...c,
        sameSite: c.sameSite === 'no_restriction' ? 'None' : (c.sameSite === 'unspecified' ? 'Lax' : c.sameSite)
    }));

    await context.addCookies(formattedCookies);

    const page = await context.newPage();

    try {
        await page.goto('https://www.mercadolivre.com.br/afiliados/linkbuilder#hub', { waitUntil: 'networkidle' });
        await page.waitForTimeout(5000); 

        const url = page.url();
        const text = await page.evaluate(() => document.body.innerText);
        const iframes = await page.evaluate(() => Array.from(document.querySelectorAll('iframe')).map(i => i.src));

        fs.writeFileSync('debug_text.txt', `URL: ${url}\nIframes: ${iframes.join(', ')}\n\nText:\n${text}`);
        console.log("✅ Dump texto concluído");
        
    } finally {
        await browser.close();
    }
}

run().catch(console.error);
