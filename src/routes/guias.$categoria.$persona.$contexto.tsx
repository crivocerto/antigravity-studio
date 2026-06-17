import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Star, ArrowRight, Zap, Trophy, Flame } from "lucide-react";

export const Route = createFileRoute(
  "/guias/$categoria/$persona/$contexto"
)({
  component: GuidePage,
});

function getCategoryTheme(slug: string) {
  const themes: Record<string, { gradient: string; glow: string; text: string }> = {
    eletronicos: { gradient: "from-teal-400 to-emerald-600", glow: "shadow-emerald-500/20", text: "text-emerald-500" },
    "casa-jardim": { gradient: "from-amber-400 to-orange-500", glow: "shadow-orange-500/20", text: "text-orange-500" },
    "esporte-fitness": { gradient: "from-rose-500 to-violet-600", glow: "shadow-rose-500/20", text: "text-rose-500" },
    moda: { gradient: "from-fuchsia-500 to-pink-600", glow: "shadow-pink-500/20", text: "text-pink-500" },
    beleza: { gradient: "from-cyan-400 to-blue-500", glow: "shadow-blue-500/20", text: "text-blue-500" },
    cozinha: { gradient: "from-red-500 to-amber-500", glow: "shadow-red-500/20", text: "text-red-500" },
  };
  return themes[slug] || { gradient: "from-[var(--color-primary)] to-emerald-500", glow: "shadow-emerald-500/20", text: "text-[var(--color-primary)]" };
}

function GuidePage() {
  const { categoria, persona, contexto } = Route.useParams();
  const theme = getCategoryTheme(categoria);

  const { data: guide, isLoading } = useQuery({
    queryKey: ["guide", categoria, persona, contexto],
    queryFn: async () => {
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
      
      if (data && data.guide_products) {
        data.guide_products.sort((a: any, b: any) => a.rank_position - b.rank_position);
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin border-[var(--color-primary)]`} />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-[var(--color-ink)] mb-4">Guia não encontrado</h1>
        <p className="text-[var(--color-mute)]">Ainda não analisamos produtos para este cenário específico.</p>
      </div>
    );
  }

  const top1 = guide.guide_products[0];
  const restTop5 = guide.guide_products.slice(1, 5);
  const top10 = guide.guide_products.slice(5);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 overflow-x-hidden">
      {/* Hero Section - Maximalismo Tátil */}
      <section className="relative pt-32 pb-24 px-4">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${theme.gradient} rounded-full blur-[100px] opacity-20 animate-pulse`} />
          <div className={`absolute top-20 -left-40 w-72 h-72 bg-gradient-to-tr ${theme.gradient} rounded-full blur-[100px] opacity-15`} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[var(--color-hairline)] shadow-sm backdrop-blur-xl mb-8 transform transition-transform hover:scale-105">
            <Zap size={16} className={theme.text} fill="currentColor" />
            <span className="text-sm font-bold text-[var(--color-ink)] uppercase tracking-wider">CrivoCerto AI Agent</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-[var(--color-ink)] tracking-tight leading-[1.1] mb-8 drop-shadow-sm">
            {guide.headline}
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-mute)] max-w-2xl mx-auto leading-relaxed font-medium">
            {guide.intro_text}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 relative z-20 space-y-12">
        {/* Escolha Principal */}
        {top1 && (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-[2.5rem] blur opacity-20"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-6 ml-2">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Trophy size={24} fill="currentColor" />
                </div>
                <h2 className="text-3xl font-black text-[var(--color-ink)] tracking-tight">
                  A Nossa Escolha Absoluta
                </h2>
              </div>
              <ProductCard item={top1} isHero theme={theme} />
            </div>
          </div>
        )}

        {/* Outras Opções */}
        {restTop5.length > 0 && (
          <div className="space-y-8 pt-12 border-t border-[var(--color-hairline)]">
             <div className="flex items-center gap-3 mb-2 ml-2">
                <div className={`bg-gradient-to-br ${theme.gradient} text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md`}>
                  <Flame size={20} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-black text-[var(--color-ink)] tracking-tight">
                  Opções Alternativas Fortes
                </h2>
              </div>
            {restTop5.map((item: any) => (
              <ProductCard key={item.products.id} item={item} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Apple Liquid Glass / Maximalismo Tátil Card
function ProductCard({ item, isHero = false, theme }: any) {
  const { products, rank_position, contextual_pitch } = item;

  // Resolvendo o formato de array do affiliate_links vindo do JSON do Gemini
  const links = Array.isArray(products.affiliate_links) ? products.affiliate_links : [];
  const amazonLink = links.find((l: any) => l.platform.toLowerCase().includes('amazon')) || products.affiliate_links?.amazon;
  const mlLink = links.find((l: any) => l.platform.toLowerCase().includes('ml') || l.platform.toLowerCase().includes('mercado')) || products.affiliate_links?.ml;
  const shopeeLink = links.find((l: any) => l.platform.toLowerCase().includes('shopee')) || products.affiliate_links?.shopee;

  // Imagem do produto com fallback de alta qualidade
  const imageUrl = products.hero_image || products.primary_image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80";

  return (
    <div
      className={`group relative bg-white border border-[var(--color-hairline)] backdrop-blur-2xl rounded-[2rem] overflow-hidden flex flex-col transition-all duration-500
        ${isHero ? "md:flex-row shadow-xl hover:shadow-2xl" : "shadow-md hover:shadow-xl hover:-translate-y-1"}
      `}
    >
      {/* Imagem Container com Fundo Suave */}
      <div className={`${isHero ? "md:w-[45%]" : "w-full"} relative bg-slate-50 flex items-center justify-center shrink-0 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[var(--color-hairline)] overflow-hidden`}>
        {/* Rank Badge */}
        <div className={`absolute top-6 left-6 ${isHero ? "bg-amber-500" : "bg-slate-800"} text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl z-20 shadow-lg`}>
          #{rank_position}
        </div>
        
        {/* Subtle glow behind image */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
        
        <img
          src={imageUrl}
          alt={products.title}
          className="w-full h-auto max-h-72 object-contain group-hover:scale-105 transition-transform duration-700 ease-out z-10 drop-shadow-xl mix-blend-multiply"
          loading="lazy"
        />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col p-8 md:p-10 flex-1 bg-white">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className={`${isHero ? "text-3xl" : "text-2xl"} font-black text-[var(--color-ink)] leading-tight tracking-tight`}>
            {products.name || products.title}
          </h3>
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 shrink-0 shadow-sm">
            <Star className="text-amber-500 fill-amber-500" size={16} />
            <span className="font-bold text-amber-700">9.5</span>
          </div>
        </div>

        <p className="text-[var(--color-primary)] font-bold text-sm tracking-widest uppercase mb-6">
          {products.brand} • Escolha Independente
        </p>

        {/* Pitch Contextual */}
        <div className="text-[var(--color-mute)] text-lg leading-relaxed mb-8 flex-1 prose prose-p:my-2 font-medium">
          <div dangerouslySetInnerHTML={{ __html: contextual_pitch.replace(/\n/g, '<br/>') }} />
        </div>
        
        {/* Pros/Cons simplificados se existirem */}
        {products.pros && products.pros.length > 0 && (
          <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-[var(--color-hairline)]">
            <h4 className="font-bold text-[var(--color-ink)] mb-2 flex items-center gap-2">
              <ShieldCheck size={16} className={theme.text} /> Pontos Fortes
            </h4>
            <ul className="space-y-2">
              {products.pros.slice(0, 3).map((pro: string, i: number) => (
                <li key={i} className="text-sm text-[var(--color-mute)] flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {pro}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Agressividade de Conversão: CTAs */}
        <div className="space-y-3 mt-auto pt-4 border-t border-[var(--color-hairline)]">
          {amazonLink && (
            <a
              href={amazonLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn flex items-center justify-between w-full h-14 px-6 rounded-2xl font-bold text-zinc-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:to-amber-400 hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
            >
              <span className="text-lg">Ver Oferta na Amazon</span>
              <div className="bg-white/20 p-2 rounded-xl group-hover/btn:translate-x-1 transition-transform">
                <ArrowRight size={20} />
              </div>
            </a>
          )}
          
          <div className="flex gap-3">
            {mlLink && (
              <a
                href={mlLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center flex-1 h-12 rounded-xl text-sm font-bold text-[var(--color-ink)] bg-white border border-[var(--color-hairline)] shadow-sm hover:bg-slate-50 hover:shadow-md transition-all"
              >
                Mercado Livre
              </a>
            )}
            {shopeeLink && (
              <a
                href={shopeeLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center flex-1 h-12 rounded-xl text-sm font-bold text-[var(--color-ink)] bg-white border border-[var(--color-hairline)] shadow-sm hover:bg-slate-50 hover:shadow-md transition-all"
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
