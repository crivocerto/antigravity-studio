import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { searchPosts } from "@/data/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Search, ArrowLeft } from "lucide-react";
import { useState } from "react";

const searchSchema = z.object({
  q: z.string().optional().default(""),
});

export const Route = createFileRoute("/busca")({
  validateSearch: searchSchema,
  component: BuscaPage,
});

function BuscaPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q);
  const navigate = Route.useNavigate();

  const results = q ? searchPosts(q) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: { q: query } });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-mute)] hover:text-[var(--color-primary)] mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Início
      </Link>

      <h1 className="text-2xl font-extrabold text-[var(--color-ink)] mb-6">Buscar reviews</h1>

      <form onSubmit={handleSearch} className="relative mb-8">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
        />
        <input
          id="busca-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por produto, marca, categoria..."
          className="w-full rounded-xl border border-[var(--color-hairline)] bg-white pl-11 pr-4 py-3.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
        />
        <button
          type="submit"
          id="busca-submit-btn"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-[var(--color-primary-deep)] transition-colors"
        >
          Buscar
        </button>
      </form>

      {q && (
        <p className="text-sm text-[var(--color-mute)] mb-6">
          {results.length} resultado{results.length !== 1 ? "s" : ""} para{" "}
          <strong className="text-[var(--color-ink)]">"{q}"</strong>
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : q ? (
        <div className="text-center py-16 text-[var(--color-mute)]">
          <p className="text-lg font-semibold">Nenhum resultado encontrado</p>
          <p className="text-sm mt-1">Tente buscar por outro termo ou navegue pelas categorias.</p>
          <Link to="/" className="mt-4 inline-flex text-[var(--color-primary)] underline text-sm">
            Ver todos os reviews
          </Link>
        </div>
      ) : null}
    </div>
  );
}
