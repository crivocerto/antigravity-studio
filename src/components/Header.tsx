"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, LayoutDashboard, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ease-out backdrop-blur-md ${
        scrolled
          ? "bg-white/80 dark:bg-black/80 border-white/10 shadow-sm"
          : "bg-white/90 dark:bg-black/90 border-transparent"
      }`}
    >
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            {mounted && (
              <Image 
                src={resolvedTheme === 'dark' ? '/logo-branca.png' : '/logo-preta.png'} 
                alt="Logo CrivoCerto" 
                width={32} 
                height={32} 
                className="rounded-full"
              />
            )}
            <h1 className="text-xl font-extrabold text-[var(--color-ink)] tracking-tight group-hover:text-[var(--color-primary)] transition-colors duration-300">
              Crivo<span className="text-[var(--color-primary)] font-black">Certo</span>
            </h1>
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
                  : "text-[var(--color-mute)] hover:text-[var(--color-ink)] hover:bg-gray-100/60 dark:hover:bg-zinc-800"
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

            {/* Grupo VIP WhatsApp */}
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
              title="Entrar no Grupo VIP"
            >
              <MessageCircle size={18} />
              <span className="hidden md:inline text-xs font-semibold">Grupo VIP</span>
            </a>

            {/* Theme Toggle */}
            <ThemeToggle />

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
