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
  created_at: string;
}

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      
      if (!isConfigured) {
        setLoading(false);
        return;
      }
      
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

  return (
    <div className="w-full min-h-[50vh]">
      {loading ? (
        <div className="flex justify-center p-10 mt-10">
          <span className="animate-pulse text-gray-500 font-medium">Carregando ofertas exclusivas...</span>
        </div>
      ) : (
        <ProductGrid products={deals} />
      )}
    </div>
  );
}
