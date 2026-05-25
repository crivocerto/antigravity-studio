import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import { getPosts } from "@/data/posts";

export const Route = createFileRoute("/reviews")({
  loader: async () => {
    const posts = await getPosts();
    return { posts };
  },
  component: ReviewsPage,
});

function ReviewsPage() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="animate-fade-in bg-[var(--color-surface)] min-h-screen pb-20">
      {/* Header Title */}
      <div className="bg-white border-b border-[var(--color-hairline)] pt-32 pb-12 px-4 shadow-sm">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--color-ink)] tracking-tight mb-4">
            Todos os <span className="text-[var(--color-primary)]">Reviews</span>
          </h1>
          <p className="text-lg text-[var(--color-mute)] max-w-2xl mx-auto leading-relaxed">
            Navegue pelo nosso acervo completo de avaliações. Produtos reais testados sem enrolação.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[var(--color-hairline)] shadow-sm">
            <Search size={40} className="mx-auto text-[var(--color-stone)] mb-4" />
            <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">
              Nenhum review encontrado
            </h3>
            <p className="text-[var(--color-mute)] mb-6">
              Ainda não temos reviews publicados, volte em breve!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[var(--color-surface)] hover:bg-[var(--color-hairline)] text-[var(--color-ink)] px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              Voltar ao Início
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
