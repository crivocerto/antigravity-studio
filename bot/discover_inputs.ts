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
        await page.waitForTimeout(5000); // wait for react to render

        const inputs = await page.$$eval('input', els => els.map(e => ({
            id: e.id,
            name: e.name,
            type: e.type,
            placeholder: e.placeholder,
            class: e.className,
            outerHTML: e.outerHTML
        })));

        const buttons = await page.$$eval('button', els => els.map(e => ({
            id: e.id,
            text: e.innerText,
            class: e.className,
            outerHTML: e.outerHTML
        })));

        fs.writeFileSync('debug_inputs.json', JSON.stringify({ inputs, buttons }, null, 2));
        console.log("✅ Dump inputs e buttons salvo em debug_inputs.json");
    } finally {
        await browser.close();
    }
}

run().catch(console.error);
