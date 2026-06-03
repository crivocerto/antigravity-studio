import { Link } from "@tanstack/react-router";
import { Clock, Star, ArrowRight } from "lucide-react";
import type { Post } from "@/data/posts";

interface PostCardProps {
  post: Post;
  variant?: "default" | "featured" | "compact";
}

function RatingBadge({ rating }: { rating: number }) {
  const color =
    rating >= 8.5
      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
      : rating >= 7
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${color}`}
    >
      <Star size={10} fill="currentColor" />
      {rating.toFixed(1)}
    </span>
  );
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  if (post.slug.startsWith("error")) {
    return (
      <div className="group flex flex-col rounded-xl border border-red-200 bg-red-50 overflow-hidden shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-red-600 font-medium">
            {post.category?.name || "Erro"}
          </span>
        </div>
        <h3 className="text-base font-bold text-red-800 leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-red-700 mt-1.5 break-all">
          {post.content}
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    const isGuide = post.slug.startsWith("/guias/");
    return (
      <Link
        to={isGuide ? (post.slug as any) : "/review/$slug"}
        params={isGuide ? undefined : { slug: post.slug }}
        className="group flex gap-3 items-start py-3 border-b border-[var(--color-hairline)] last:border-0 hover:opacity-80 transition-opacity"
      >
        <img
          src={post.heroImage}
          alt={post.title}
          className="w-16 h-16 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <span className="text-xs text-[var(--color-primary)] font-medium">
            {post.category.name}
          </span>
          <h3 className="text-sm font-semibold text-[var(--color-ink)] leading-tight line-clamp-2 mt-0.5">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <RatingBadge rating={post.rating} />
            <span className="text-xs text-[var(--color-stone)] flex items-center gap-1">
              <Clock size={10} /> {post.readingTime} min
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    const isGuide = post.slug.startsWith("/guias/");
    
    return (
      <Link
        to={isGuide ? (post.slug as any) : "/review/$slug"}
        params={isGuide ? undefined : { slug: post.slug }}
        className="group relative overflow-hidden rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-hairline)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.heroImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">
              {post.category.name}
            </span>
            <RatingBadge rating={post.rating} />
          </div>
          <h2 className="text-lg font-bold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm text-[var(--color-mute)] mt-1.5 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-[var(--color-stone)] flex items-center gap-1">
              <Clock size={11} /> {post.readingTime} min de leitura
            </span>
            <span className="text-sm font-medium text-[var(--color-primary)] flex items-center gap-1 group-hover:gap-2 transition-all">
              Ler review <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // default
  const isGuide = post.slug.startsWith("/guias/");
  return (
    <Link
      to={isGuide ? (post.slug as any) : "/review/$slug"}
      params={isGuide ? undefined : { slug: post.slug }}
      className="group flex flex-col rounded-xl border border-[var(--color-hairline)] bg-white overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={post.heroImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--color-primary)] font-medium">
            {post.category.name}
          </span>
          <RatingBadge rating={post.rating} />
        </div>
        <h3 className="text-base font-bold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-[var(--color-mute)] mt-1.5 line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        <span className="text-xs text-[var(--color-stone)] flex items-center gap-1 mt-3">
          <Clock size={11} /> {post.readingTime} min
        </span>
      </div>
    </Link>
  );
}
