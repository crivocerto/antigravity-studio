"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl rounded-3xl border border-white/20 transition-all duration-300 ease-out backdrop-blur-xl ${
        scrolled
          ? "top-3 bg-white/70 scale-95 shadow-lg border-white/10"
          : "top-14 bg-white/90 scale-100"
      }`}
      style={{
        boxShadow: scrolled
          ? "0 4px 20px -2px rgba(13, 154, 110, 0.15), 0 2px 8px -1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
          : "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
      }}
    >
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="text-xl font-extrabold text-[var(--color-ink)] tracking-tight group-hover:text-[var(--color-primary)] transition-colors duration-300">
              Crivo<span className="text-[var(--color-primary)] font-black">Certo</span>
            </span>
          </Link>

          {/* Nav Desktop - Primary Navigation Only */}
          <nav className="hidden md:flex items-center gap-2 bg-gray-100/50 p-1 rounded-full border border-gray-200/20">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                isActive("/")
                  ? "bg-white text-[var(--color-primary)] shadow-sm"
                  : "text-[var(--color-mute)] hover:text-[var(--color-ink)] hover:bg-white/50"
              }`}
            >
              Início
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                searchOpen
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "text-[var(--color-mute)] hover:text-[var(--color-ink)] hover:bg-gray-100/60"
              }`}
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>

            {/* Admin Access Panel */}
            <Link
              href="/admin"
              className="p-2 rounded-xl text-[var(--color-mute)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all duration-300"
              title="Painel Admin"
              aria-label="Painel Admin"
            >
              <LayoutDashboard size={18} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-[var(--color-mute)] hover:text-[var(--color-ink)] hover:bg-gray-100/60 transition-all duration-300"
              aria-label="Menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Search Expanded */}
        {searchOpen && (
          <div className="mt-3 pt-3 border-t border-gray-100 animate-slide-up">
            <form onSubmit={handleSearch} className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O que você está procurando hoje?"
                autoFocus
                className="w-full rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)]/80 pl-10 pr-4 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-300"
              />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100 animate-slide-up">
            <nav className="flex flex-col gap-1.5 pb-2">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide uppercase transition-colors ${
                  isActive("/")
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-body)] hover:bg-gray-100/60"
                }`}
              >
                Início
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
