// @ts-ignore
import googleTrends from 'google-trends-api';
import fs from 'fs';

async function fetchTrends() {
    console.log("🔥 Buscando tendências virais de Maquiagem/Beleza no Google Trends (BR)...");
    try {
        const results = await googleTrends.relatedQueries({
            keyword: 'maquiagem',
            geo: 'BR'
        });

        const data = JSON.parse(results);
        
        // A API de relatedQueries retorna dois arrays no rankedList: [0] = Top, [1] = Rising (Breakout)
        const risingQueries = data.default.rankedList[1].rankedKeyword || [];
        
        const topQueries: string[] = [];
        
        for (const item of risingQueries) {
            // Pegar as palavras em ascensão (Breakout)
            const query = item.query;
            
            // Filtrar termos muito genéricos ou inúteis (opcional)
            if (query && !topQueries.includes(query)) {
                topQueries.push(query);
            }
            if (topQueries.length >= 3) break;
        }

        console.log("📈 Top 3 Termos Virais em Ascensão:", topQueries);
        
        fs.writeFileSync('viral.json', JSON.stringify(topQueries, null, 2), 'utf8');
        console.log("✅ Termos salvos em viral.json");

    } catch (e) {
        console.error("❌ Erro ao buscar Google Trends:", e);
        // Em caso de falha, criar um JSON vazio para não quebrar o bot
        fs.writeFileSync('viral.json', JSON.stringify([]), 'utf8');
    }
}

fetchTrends();
