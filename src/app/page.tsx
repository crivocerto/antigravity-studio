"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProductGrid } from "@/components/ProductGrid";

interface Deal {
  id: string;
  title: string;
  original_price: number;
  discount_price: number;
  image_url: string;
  affiliate_url: string;
  store: string;
  categoria: string;
  created_at: string;
  is_viral?: boolean;
}

const CATEGORIES = [
  { id: 'tudo', label: 'Tudo' },
  { id: 'maquiagem', label: '✨ Maquiagem' },
  { id: 'skincare', label: '💆‍♀️ Skincare' },
  { id: 'cabelo_perfume', label: '🌸 Cabelos e Perfumes' },
];

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('tudo');

  useEffect(() => {
    async function fetchDeals() {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setDeals(data);
      } else if (error) {
        console.error("Error fetching deals:", error);
      }
      
      setLoading(false);
    }
    
    fetchDeals();
  }, []);

  const filteredDeals = deals.filter(deal => {
    if (activeCategory === 'tudo') return true;
    // Lida com casos onde a categoria seja nula (deals antigos)
    if (!deal.categoria) return activeCategory === 'geral' || activeCategory === 'tudo';
    return deal.categoria === activeCategory;
  });

  return (
    <div className="w-full min-h-[50vh] flex flex-col gap-6">
      
      {/* Hero Section */}
      <div className="px-4 pt-4 text-center">
        <h1 className="text-2xl font-black text-[var(--color-ink)] tracking-tight">
          As Melhores Ofertas do Mercado
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Curadoria de descontos reais testados contra fraudes. Links oficiais e seguros.
        </p>
      </div>

      {/* FOMO Expiration Banner */}
      <div className="px-4">
        <div className="w-full bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3 text-center md:text-left shadow-sm animate-fade-in">
          <span className="text-2xl animate-pulse">🚨</span>
          <div>
            <h3 className="text-orange-800 dark:text-orange-300 font-bold text-sm">ATENÇÃO: Ofertas em Tempo Real!</h3>
            <p className="text-orange-700 dark:text-orange-400 text-xs mt-0.5">Nossos robôs atualizam os produtos diariamente. <b>Todos os links e descontos expiram em 24 horas!</b></p>
          </div>
        </div>
      </div>

      {/* Scrollable Pills Menu */}
      <div className="w-full overflow-x-auto no-scrollbar py-2 px-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 ${
                activeCategory === cat.id 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-700 scale-105' 
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10 mt-10">
          <span className="animate-pulse text-pink-500 font-medium">Carregando ofertas exclusivas...</span>
        </div>
      ) : (
        <div className="px-4">
          {filteredDeals.length > 0 ? (
            <ProductGrid products={filteredDeals} />
          ) : (
            <div className="text-center text-gray-500 py-10">
              Nenhuma oferta encontrada para essa categoria no momento. 😔
            </div>
          )}
        </div>
      )}
    </div>
  );
}
