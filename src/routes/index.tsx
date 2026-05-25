import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import { getCategories, getFeaturedPosts, getPosts } from "@/data/posts";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [featured, allRecent, categories] = await Promise.all([
      getFeaturedPosts(),
      getPosts(),
      getCategories(),
    ]);
    return {
      featured,
      recent: allRecent.slice(0, 6),
      categories,
    };
  },
  component: HomePage,
});

function HomePage() {
  const { featured, recent, categories } = Route.useLoaderData();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#f0fdf8] to-white border-b border-[var(--color-hairline)] py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Zap size={12} fill="currentColor" />
            Reviews publicados diariamente pelo nosso agente
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-ink)] leading-tight tracking-tight mb-4">
            Reviews que você pode
            <span className="text-[var(--color-primary)]"> confiar</span>
          </h1>
          <p className="text-lg text-[var(--color-mute)] max-w-2xl mx-auto leading-relaxed mb-8">
            Avaliamos produtos reais com critérios claros. Sem jargão de marketing,
            sem opinião paga. Só o que você precisa saber antes de comprar.
          </p>

          {/* Diferenciais */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {[
              { icon: ShieldCheck, label: "Reviews independentes" },
              { icon: TrendingUp, label: "Atualizado diariamente" },
              { icon: Zap, label: "Compra em 1 clique" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-sm text-[var(--color-body)]"
              >
                <Icon size={15} className="text-[var(--color-primary)]" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Destaques */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-ink)]">
              Reviews em destaque
            </h2>
            <Link
              to="/busca"
              className="text-sm text-[var(--color-primary)] flex items-center gap-1 hover:gap-2 transition-all font-medium"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} variant="featured" />
            ))}
          </div>
        </section>

        {/* Grid de posts recentes */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-[var(--color-ink)] mb-6">
            Publicados recentemente
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Categorias - Maximalismo Tátil 2026 */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-[var(--color-ink)] mb-6 tracking-tight">
            Navegue por Categoria
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const style = {
                eletronicos: {
                  gradient: "from-teal-400 to-emerald-600",
                  glow: "shadow-emerald-500/10 hover:shadow-emerald-500/35",
                  emoji: "💻",
                },
                "casa-jardim": {
                  gradient: "from-amber-400 to-orange-500",
                  glow: "shadow-orange-500/10 hover:shadow-orange-500/35",
                  emoji: "🏡",
                },
                "esporte-fitness": {
                  gradient: "from-rose-500 to-violet-600",
                  glow: "shadow-rose-500/10 hover:shadow-rose-500/35",
                  emoji: "💪",
                },
                moda: {
                  gradient: "from-fuchsia-500 to-pink-600",
                  glow: "shadow-pink-500/10 hover:shadow-pink-500/35",
                  emoji: "👟",
                },
                beleza: {
                  gradient: "from-cyan-400 to-blue-500",
                  glow: "shadow-blue-500/10 hover:shadow-blue-500/35",
                  emoji: "✨",
                },
                cozinha: {
                  gradient: "from-red-500 to-amber-500",
                  glow: "shadow-red-500/10 hover:shadow-red-500/35",
                  emoji: "🍳",
                },
              }[cat.id] || {
                gradient: "from-gray-500 to-slate-700",
                glow: "shadow-slate-500/10 hover:shadow-slate-500/35",
                emoji: "📦",
              };

              return (
                <Link
                  key={cat.id}
                  to="/categoria/$slug"
                  params={{ slug: cat.slug }}
                  className={`group relative overflow-hidden flex flex-col justify-between p-5 rounded-3xl bg-gradient-to-br ${style.gradient} border border-white/10 shadow-lg ${style.glow} hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 aspect-[1.3/1]`}
                  style={{
                    boxShadow: "0 4px 15px -3px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  {/* Decorative background element */}
                  <div className="absolute -right-2 -bottom-2 text-6xl opacity-15 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500 select-none">
                    {style.emoji}
                  </div>

                  {/* Icon Container */}
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/15 group-hover:scale-110 transition-transform duration-300">
                    {style.emoji}
                  </div>

                  {/* Title & Description */}
                  <div className="z-10 mt-4">
                    <span className="block text-xs font-black tracking-widest text-white/70 uppercase">
                      Explorar
                    </span>
                    <h3 className="text-base font-black text-white leading-tight mt-0.5 drop-shadow-sm">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
