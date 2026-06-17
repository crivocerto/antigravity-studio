import { supabase } from "@/lib/supabase";
import { ProductGrid } from "@/components/ProductGrid";

// Opt out of static rendering to ensure fresh deals, or use revalidate.
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  let deals: any[] = [];

  if (isConfigured) {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching deals:", error);
    } else if (data) {
      deals = data;
    }
  }

  return (
    <div className="w-full">
      <ProductGrid products={deals || []} />
    </div>
  );
}
