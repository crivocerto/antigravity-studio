import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import { CATEGORIES, getFeaturedPosts, POSTS } from "@/data/posts";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const featured = getFeaturedPosts();
  const recent = POSTS.slice(0, 6);

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

        {/* Categorias */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-ink)] mb-6">
            Navegue por categoria
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to="/categoria/$slug"
                params={{ slug: cat.slug }}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--color-hairline)] bg-white hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all duration-150 text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-mute)] group-hover:text-[var(--color-primary)] transition-colors text-lg">
                  📦
                </div>
                <span className="text-xs font-medium text-[var(--color-body)] group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
