import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPostsByCategory, CATEGORIES } from "@/data/posts";
import { PostCard } from "@/components/blog/PostCard";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    const category = CATEGORIES.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    const posts = getPostsByCategory(params.slug);
    return { category, posts };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category, posts } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-mute)] hover:text-[var(--color-primary)] mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Início
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">{category.name}</h1>
        <p className="text-[var(--color-mute)] mt-1.5">{category.description}</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-mute)]">
          <p className="text-lg">Nenhum review publicado nesta categoria ainda.</p>
          <Link to="/" className="mt-4 inline-flex text-[var(--color-primary)] underline text-sm">
            Ver todos os reviews
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
