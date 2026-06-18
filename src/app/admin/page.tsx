import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { deleteDeal, updateDealPrice, addManualDeal } from '@/actions/admin';
import { logoutAction } from '@/actions/auth';
import { revalidatePath } from 'next/cache';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminDashboard() {
  // Busca o Top 5 via RPC
  const { data: topDeals } = await supabase.rpc('get_top_deals');
  
  // Busca todas as ofertas
  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-500 text-sm">Controle de vitrine e inteligência de dados</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition">
              Sair
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda: Form & Analytics */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Widget: Top 5 */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                🔥 Top 5 Mais Clicados
              </h2>
              <div className="space-y-4">
                {topDeals && topDeals.length > 0 ? (
                  topDeals.map((deal: any, i: number) => (
                    <div key={deal.deal_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="text-xl font-black text-pink-500 w-6 text-center">{i + 1}</div>
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0">
                        <Image src={deal.image_url} alt={deal.title} fill className="object-contain p-1" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-gray-900 truncate">{deal.title}</h3>
                        <p className="text-xs text-gray-500">{deal.clicks_count} cliques</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Nenhum dado ainda.</p>
                )}
              </div>
            </section>

            {/* Formulário Manual */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">✨ Injeção Manual</h2>
              <form action={addManualDeal} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
                  <input name="title" required className="w-full text-sm px-3 py-2 border rounded-lg" placeholder="Ex: iPhone 15" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Preço Original</label>
                    <input name="original_price" type="number" step="0.01" className="w-full text-sm px-3 py-2 border rounded-lg" placeholder="R$ 0,00" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Preço com Desconto</label>
                    <input name="discount_price" type="number" step="0.01" required className="w-full text-sm px-3 py-2 border rounded-lg border-pink-300" placeholder="R$ 0,00" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link de Afiliado (Curto)</label>
                  <input name="affiliate_url" required className="w-full text-sm px-3 py-2 border rounded-lg" placeholder="https://meli.la/xyz" />
                  <p className="text-[10px] text-gray-500 mt-1">* Cole o link já convertido para não perder a comissão.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">URL da Imagem</label>
                  <input name="image_url" required className="w-full text-sm px-3 py-2 border rounded-lg" placeholder="https://http2.mlstatic..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Categoria</label>
                  <select name="categoria" className="w-full text-sm px-3 py-2 border rounded-lg bg-white">
                    <option value="skincare">Skincare</option>
                    <option value="maquiagem">Maquiagem</option>
                    <option value="cabelo_perfume">Cabelos e Perfumes</option>
                    <option value="geral">Geral</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white font-medium py-2 rounded-lg hover:bg-gray-800 transition text-sm">
                  Adicionar Oferta
                </button>
              </form>
            </section>
          </div>

          {/* Coluna Direita: Tabela CRUD */}
          <div className="lg:col-span-2">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Gerenciar Vitrine</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Produto</th>
                      <th className="px-6 py-4">Categoria</th>
                      <th className="px-6 py-4">Preço</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {deals?.map((deal) => (
                      <tr key={deal.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-100 shrink-0">
                            <Image src={deal.image_url} alt={deal.title} fill className="object-contain" sizes="40px" />
                          </div>
                          <div className="max-w-[200px]">
                            <p className="font-semibold text-gray-900 truncate" title={deal.title}>{deal.title}</p>
                            <a href={deal.affiliate_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-pink-500 hover:underline truncate block">
                              Ver Link
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                            {deal.categoria || 'Geral'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <form action={async (formData) => {
                            'use server';
                            const newPrice = parseFloat(formData.get('price') as string);
                            await updateDealPrice(deal.id, newPrice);
                          }} className="flex items-center gap-2">
                            <input 
                              name="price" 
                              type="number" 
                              step="0.01" 
                              defaultValue={deal.discount_price} 
                              className="w-20 px-2 py-1 text-sm border rounded bg-white text-gray-900 font-medium" 
                            />
                            <button type="submit" className="text-gray-400 hover:text-green-600 transition" title="Salvar preço">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            </button>
                          </form>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <form action={async () => {
                            'use server';
                            await deleteDeal(deal.id);
                          }}>
                            <button type="submit" className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition">
                              Excluir
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                    {(!deals || deals.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          Nenhuma oferta no banco de dados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
