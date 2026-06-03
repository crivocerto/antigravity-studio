import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Star, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute(
  "/guias/$categoria/$persona/$contexto"
)({
  component: GuidePage,
});

function GuidePage() {
  const { categoria, persona, contexto } = Route.useParams();

  // Fetch from Supabase
  const { data: guide, isLoading } = useQuery({
    queryKey: ["guide", categoria, persona, contexto],
    queryFn: async () => {
      // Usamos a mesma URL como slug único do guia para localizar
      const path = `/guias/${categoria}/${persona}/${contexto}`;
      
      const { data, error } = await supabase
        .from("guides")
        .select(`
          *,
          guide_products(
            rank_position,
            contextual_pitch,
            products(*)
          )
        `)
        .eq("url_path", path)
        .single();
        
      if (error) throw error;
      
      // Ordena por rank
      if (data && data.guide_products) {
        data.guide_products.sort((a, b) => a.rank_position - b.rank_position);
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <h1 className="text-4xl font-bold text-white mb-4">Guia não encontrado</h1>
        <p>Ainda não analisamos produtos para este cenário específico.</p>
      </div>
    );
  }

  const top1 = guide.guide_products[0];
  const restTop5 = guide.guide_products.slice(1, 5);
  const top10 = guide.guide_products.slice(5);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pb-20">
      {/* Hero Storytelling (Liquid Glass) */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <ShieldCheck size={16} className="text-teal-400" />
            <span className="text-sm font-bold text-zinc-300">Testado & Aprovado pelo CrivoCerto</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-8">
            {guide.headline}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            {guide.intro_text}
          </p>
        </div>
      </section>

      {/* Top 5 Bento Box */}
      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        {top1 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-amber-500 text-zinc-950 w-8 h-8 rounded flex items-center justify-center">1</span>
              Nossa Escolha Principal
            </h2>
            <ProductCard item={top1} isHero />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restTop5.map((item) => (
            <ProductCard key={item.products.id} item={item} />
          ))}
        </div>
      </section>

      {/* Top 10 Grid */}
      {top10.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mt-20">
          <h2 className="text-3xl font-black text-white mb-8 border-b border-zinc-800 pb-4">
            Outras Ótimas Opções
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {top10.map((item) => (
              <ProductCard key={item.products.id} item={item} isCompact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Subcomponente de Card (Maximalismo Tátil)
function ProductCard({ item, isHero = false, isCompact = false }: any) {
  const { products, rank_position, contextual_pitch } = item;

  const trackClick = (platform: string) => {
    // Integração futura com o clicks_tracking Supabase
    console.log(`Click Tracked: ${products.id} na ${platform}`);
  };

  return (
    <div
      className={`group relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden interactive flex flex-col ${
        isHero ? "md:flex-row shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]" : ""
      }`}
    >
      {/* Imagem (Vem direto da API Oficial) */}
      <div className={`${isHero ? "md:w-2/5" : "w-full"} relative bg-white p-8 flex items-center justify-center shrink-0`}>
        {/* Badge Ranking */}
        <div className="absolute top-4 left-4 bg-zinc-950 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-lg z-10 shadow-lg">
          {rank_position}
        </div>
        <img
          src={products.primary_image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"}
          alt={products.title}
          className="w-full h-auto object-contain max-h-64 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Conteúdo */}
      <div className={`flex flex-col p-6 lg:p-8 flex-1`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className={`${isHero ? "text-3xl" : "text-xl"} font-bold text-white leading-tight`}>
            {products.title}
          </h3>
          <div className="flex items-center gap-1 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 shrink-0">
            <Star className="text-amber-500 fill-amber-500" size={16} />
            <span className="font-bold text-white">{products.crivo_score}</span>
          </div>
        </div>

        {/* Pitch Contextual (Por que está aqui?) */}
        <div className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1 prose prose-invert prose-p:my-1">
          {/* Supondo que contextual_pitch é markdown simples */}
          <div dangerouslySetInnerHTML={{ __html: contextual_pitch.replace(/\n/g, '<br/>') }} />
        </div>

        {/* Agressividade de Conversão: CTA Principal */}
        <div className="space-y-3 mt-auto">
          {products.affiliate_links?.amazon && (
            <a
              href={products.affiliate_links.amazon}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("amazon")}
              className="flex items-center justify-between w-full h-12 px-6 rounded-xl font-bold text-zinc-950 bg-teal-400 hover:bg-teal-300 transition-all cta-primary group/btn"
            >
              <span>Ver Preço na Amazon</span>
              <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </a>
          )}
          
          <div className="flex gap-3">
            {products.affiliate_links?.ml && (
              <a
                href={products.affiliate_links.ml}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("ml")}
                className="flex items-center justify-center flex-1 h-10 rounded-lg text-xs font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                Mercado Livre
              </a>
            )}
            {products.affiliate_links?.shopee && (
              <a
                href={products.affiliate_links.shopee}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("shopee")}
                className="flex items-center justify-center flex-1 h-10 rounded-lg text-xs font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                Shopee
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
