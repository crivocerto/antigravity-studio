// @ts-ignore
import googleTrends from 'google-trends-api';
import fs from 'fs';

const SEED_KEYWORDS = {
    "skincare": ["skincare", "sérum", "hidratante", "protetor solar"],
    "maquiagem": ["maquiagem", "base", "blush", "batom", "corretivo"],
    "cabelo_perfume": ["perfume", "shampoo", "cabelo"]
};

async function fetchTrends() {
    console.log("🔥 Buscando tendências virais por nicho no Google Trends (BR)...");
    
    const viralData: Record<string, string[]> = {
        "skincare": [],
        "maquiagem": [],
        "cabelo_perfume": []
    };

    for (const [nicho, seeds] of Object.entries(SEED_KEYWORDS)) {
        console.log(`\n🔍 Analisando nicho: ${nicho}...`);
        
        for (const seed of seeds) {
            try {
                // Aguarda 1 seg para não tomar rate limit do Google
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const results = await googleTrends.relatedQueries({
                    keyword: seed,
                    geo: 'BR'
                });

                const data = JSON.parse(results);
                
                if (!data.default || !data.default.rankedList || data.default.rankedList.length < 2) continue;
                
                const risingQueries = data.default.rankedList[1].rankedKeyword || [];
                
                for (const item of risingQueries) {
                    const query = item.query;
                    if (query && !viralData[nicho].includes(query)) {
                        viralData[nicho].push(query);
                    }
                    if (viralData[nicho].length >= 2) break; // Top 2 por nicho está ótimo
                }

                if (viralData[nicho].length >= 2) break; // Já achou os virais deste nicho

            } catch (e) {
                console.log(`⚠️ Falha ao buscar seed '${seed}': Rate limit ou erro na API.`);
            }
        }
        
        console.log(`📈 Virais em ${nicho}:`, viralData[nicho]);
    }

    fs.writeFileSync('viral.json', JSON.stringify(viralData, null, 2), 'utf8');
    console.log("\n✅ Termos categorizados salvos em viral.json");
}

fetchTrends();
