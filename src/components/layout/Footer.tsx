import { Link } from "@tanstack/react-router";
import { Check, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, type Category } from "@/data/posts";

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] mt-20">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="CrivoCerto" className="w-8 h-8 object-contain drop-shadow-sm" />
              <span className="text-base font-bold text-[var(--color-ink)]">CrivoCerto</span>
            </Link>
            <p className="text-sm text-[var(--color-mute)] leading-relaxed max-w-xs">
              Reviews honestos de produtos para ajudar você a comprar com confiança. Sem
              papo de IA, sem clichê.
            </p>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">Categorias</h3>
            <ul className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to="/categoria/$slug"
                    params={{ slug: cat.slug }}
                    className="text-sm text-[var(--color-mute)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">Sobre</h3>
            <ul className="flex flex-col gap-1.5">
              <li>
                <Link
                  to="/como-avaliamos"
                  className="text-sm text-[var(--color-mute)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Como avaliamos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-hairline)] pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-stone)]">
            © {new Date().getFullYear()} CrivoCerto. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
