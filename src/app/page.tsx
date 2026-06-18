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
      
      {/* Scrollable Pills Menu */}
      <div className="w-full overflow-x-auto no-scrollbar py-2 px-4 border-b border-gray-100">
        <div className="flex gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeCategory === cat.id 
                ? 'bg-pink-500 text-white shadow-md scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
