import { supabase } from "@/lib/supabase";
import { ProductGrid } from "@/components/ProductGrid";

export const revalidate = 300; // 5 minutes cache (SSG)

export default async function Home() {
  const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  let deals: any[] = [];

  if (isConfigured) {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      deals = data;
    } else if (error) {
      console.error("Error fetching deals:", error);
    }
  }

  return (
    <div className="w-full min-h-[50vh]">
      <ProductGrid products={deals} />
    </div>
  );
}
