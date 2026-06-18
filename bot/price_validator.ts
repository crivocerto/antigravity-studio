export interface AuditResult {
    preco_atual: number;
    preco_antigo: number;
    desconto_percentual: number;
}

/**
 * Extrai o ID MLB de uma URL do Mercado Livre usando Expressões Regulares.
 * @param url A URL orgânica raspada pelo bot.
 * @returns O ID no formato 'MLB123456789' ou null em caso de falha.
 */
export function extrairIdMLB(url: string): string | null {
    const match = url.match(/MLB-?(\d+)/);
    return match ? `MLB${match[1]}` : null;
}

/**
 * Consulta a API Pública do Mercado Livre para auditar o desconto real.
 * Regra de Negócio: Exige original_price válido e mínimo de 15% de desconto.
 * @param urlProduto A URL orgânica raspada na página.
 * @returns Retorna o payload de preços se aprovado, ou false se reprovado.
 */
export async function validarDescontoReal(urlProduto: string): Promise<AuditResult | false> {
    const idMLB = extrairIdMLB(urlProduto);
    
    if (!idMLB) {
        console.warn(`[Validador] ❌ ID não encontrado na URL: ${urlProduto}`);
        return false; 
    }

    try {
        console.log(`[Validador] 🔍 Auditando histórico do produto: ${idMLB}...`);
        
        // Chamada à API oficial do ML (Não requer Token/Auth)
        const response = await fetch(`https://api.mercadolibre.com/items/${idMLB}`);
        if (!response.ok) {
            console.error(`[Validador] 🚨 Erro HTTP ${response.status} ao consultar API para ${idMLB}`);
            return false;
        }

        const data = await response.json();

        const precoAtual = data.price;
        const precoHistorico = data.original_price;

        // Regra 1: O produto precisa ter um preço histórico registrado pelo ML
        if (!precoHistorico) {
            console.warn(`[Validador] ⚠️ Reprovado: ${idMLB} não possui 'original_price' (Falso Desconto).`);
            return false;
        }

        // Regra 2: Cálculo exato da porcentagem de desconto
        const descontoPercentual = ((precoHistorico - precoAtual) / precoHistorico) * 100;

        // Regra 3: O desconto deve ser de no mínimo 15%
        if (descontoPercentual >= 15) {
            console.log(`[Validador] ✅ Aprovado: ${idMLB} com ${descontoPercentual.toFixed(1)}% OFF real.`);
            return {
                preco_atual: precoAtual,
                preco_antigo: precoHistorico,
                desconto_percentual: Math.round(descontoPercentual)
            };
        } else {
            console.warn(`[Validador] ❌ Reprovado: ${idMLB} tem apenas ${descontoPercentual.toFixed(1)}% OFF.`);
            return false;
        }

    } catch (erro) {
        console.error(`[Validador] 🚨 Erro de API no item ${idMLB}: ${erro instanceof Error ? erro.message : erro}`);
        return false;
    }
}
