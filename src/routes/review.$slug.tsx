import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Star,
  ShoppingCart,
  Check,
  X,
  Clock,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { getPostBySlug, getPostsByCategory } from "@/data/posts";
import { PostCard } from "@/components/blog/PostCard";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/review/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug(params.slug);
    if (!post) throw notFound();
    
    let relatedPosts = [];
    if (post.category) {
      relatedPosts = await getPostsByCategory(post.category.slug);
    }
    const related = relatedPosts.filter((p) => p.id !== post.id).slice(0, 3);

    return { post, related };
  },
  component: ReviewPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--color-ink)]">Review não encontrado</h1>
        <Link to="/" className="mt-4 inline-flex text-[var(--color-primary)] underline">
          Voltar ao início
        </Link>
      </div>
    </div>
  ),
});

function RatingMeter({ rating }: { rating: number }) {
  const color =
    rating >= 8.5
      ? "bg-[var(--color-primary)]"
      : rating >= 7
        ? "bg-amber-500"
        : "bg-red-500";

  const label =
    rating >= 9
      ? "Excepcional"
      : rating >= 8
        ? "Muito Bom"
        : rating >= 7
          ? "Bom"
          : rating >= 6
            ? "Regular"
            : "Fraco";

  return (
    <div className="flex items-center gap-4 p-5 rounded-xl border border-[var(--color-hairline)] bg-white">
      <div className="relative w-20 h-20 shrink-0">
        <svg className="rotate-[-90deg]" width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#f0f0f0" strokeWidth="8" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke={rating >= 8.5 ? "#0d9a6e" : rating >= 7 ? "#d97706" : "#dc2626"}
            strokeWidth="8"
            strokeDasharray={`${(rating / 10) * 213.6} 213.6`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-extrabold text-[var(--color-ink)]">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
      <div>
        <div className="text-lg font-bold text-[var(--color-ink)]">{label}</div>
        <div className="text-sm text-[var(--color-mute)] mt-0.5">Nossa nota final</div>
        <div className="flex gap-0.5 mt-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full flex-1 ${i < Math.round(rating) ? color : "bg-gray-100"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewPage() {
  const { post, related } = Route.useLoaderData();

  const handleAffiliateClick = (platform: "amazon" | "mercadolivre" | "shopee", url: string) => {
    supabase
      .from("clicks_tracking")
      .insert({
        post_id: post.id,
        platform,
        url,
        user_agent: navigator.userAgent,
      })
      .then(({ error }) => {
        if (error) {
          console.error("Error tracking click:", error);
        }
      });
  };

  const platformLabel: Record<string, string> = {
    amazon: "Amazon",
    mercadolivre: "Mercado Livre",
    shopee: "Shopee",
  };

  const platformColor: Record<string, string> = {
    amazon: "bg-[#FF9900] hover:bg-[#e68900] text-black",
    mercadolivre: "bg-[#FFE600] hover:bg-[#e6cf00] text-[#333]",
    shopee: "bg-[#EE4D2D] hover:bg-[#d43e23] text-white",
  };

  return (
    <div className="animate-fade-in">
      {/* Hero image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={post.heroImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="mx-auto max-w-4xl">
            <Link
              to="/categoria/$slug"
              params={{ slug: post.category.slug }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full mb-3 hover:bg-white/30 transition-colors"
            >
              {post.category.name}
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Star size={13} fill="currentColor" />
                {post.rating.toFixed(1)}/10
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {post.readingTime} min de leitura
              </span>
              <span>{new Date(post.publishedAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-mute)] hover:text-[var(--color-primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <p className="text-lg text-[var(--color-body)] leading-relaxed mb-8 font-medium">
              {post.excerpt}
            </p>

            {/* Nota */}
            <RatingMeter rating={post.rating} />

            {/* Prós e Contras */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-4">
                <h3 className="text-sm font-bold text-[var(--color-primary)] mb-3 flex items-center gap-1.5">
                  <Check size={14} /> Pontos positivos
                </h3>
                <ul className="flex flex-col gap-2">
                  {post.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-body)]">
                      <Check
                        size={13}
                        className="text-[var(--color-primary)] shrink-0 mt-0.5"
                      />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-1.5">
                  <X size={14} /> Pontos negativos
                </h3>
                <ul className="flex flex-col gap-2">
                  {post.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-body)]">
                      <X size={13} className="text-red-500 shrink-0 mt-0.5" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Conteúdo do review */}
            <div className="mt-8 prose prose-sm max-w-none">
              {post.content.split("\n\n").map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="text-xl font-bold text-[var(--color-ink)] mt-8 mb-3"
                    >
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("- **")) {
                  return (
                    <ul key={i} className="list-disc list-inside space-y-1 mb-4">
                      {paragraph.split("\n").map((item, j) => (
                        <li key={j} className="text-[var(--color-body)] text-sm leading-relaxed">
                          {item.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="text-[var(--color-body)] leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Sidebar — preços */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {/* Comprar agora */}
              <div className="rounded-xl border border-[var(--color-hairline)] bg-white p-5 mb-4">
                <h3 className="text-sm font-bold text-[var(--color-ink)] mb-4 flex items-center gap-1.5">
                  <ShoppingCart size={15} />
                  Onde comprar
                </h3>
                <div className="flex flex-col gap-3">
                  {post.affiliateLinks.map((link, i) => (
                    <div key={i}>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        id={`buy-btn-${link.platform}-${i}`}
                        onClick={() => handleAffiliateClick(link.platform, link.url)}
                        className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg text-sm font-bold transition-colors ${platformColor[link.platform] ?? "bg-gray-800 text-white hover:bg-gray-700"}`}
                      >
                        <ExternalLink size={14} />
                        {link.label ?? `Ver no ${platformLabel[link.platform]}`}
                      </a>
                    </div>
                  ))}
                </div>
              </div>



              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-mute)] border border-[var(--color-hairline)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="mt-16 pt-8 border-t border-[var(--color-hairline)]">
            <h2 className="text-xl font-bold text-[var(--color-ink)] mb-6">
              Mais reviews de {post.category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
