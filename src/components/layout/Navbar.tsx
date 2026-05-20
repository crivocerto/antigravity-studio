import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Menu, X, CheckCircle2 } from "lucide-react";
import { CATEGORIES } from "@/data/posts";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-hairline)] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white">
              <CheckCircle2 size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-[var(--color-ink)] tracking-tight">
              CrivoCerto
            </span>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                isActive("/")
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "text-[var(--color-body)] hover:text-[var(--color-ink)] hover:bg-gray-100"
              }`}
            >
              Início
            </Link>
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                to="/categoria/$slug"
                params={{ slug: cat.slug }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                  location.pathname === `/categoria/${cat.slug}`
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-body)] hover:text-[var(--color-ink)] hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              id="search-toggle-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-[var(--color-mute)] hover:text-[var(--color-ink)] hover:bg-gray-100 transition-colors"
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--color-mute)] hover:text-[var(--color-ink)] hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Search bar expandida */}
        {searchOpen && (
          <div className="pb-3 animate-slide-up">
            <form onSubmit={handleSearch} className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
              />
              <input
                id="navbar-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar reviews, produtos..."
                autoFocus
                className="w-full rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface)] pl-9 pr-4 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
              />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-[var(--color-hairline)] pt-3 animate-slide-up">
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-[var(--color-body)] hover:bg-gray-100 transition-colors"
              >
                Início
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to="/categoria/$slug"
                  params={{ slug: cat.slug }}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-[var(--color-body)] hover:bg-gray-100 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
