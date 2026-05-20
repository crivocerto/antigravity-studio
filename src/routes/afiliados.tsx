import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, DollarSign, Scale } from "lucide-react";

export const Route = createFileRoute("/afiliados")({
  component: AfiliadosPage,
});

function AfiliadosPage() {
  const plataformas = [
    {
      name: "Amazon Brasil",
      tag: "crivocerto-20",
      method: "Parâmetro ?tag= na URL",
      icon: "🛒",
    },
    {
      name: "Mercado Livre",
      tag: "dd20240703053023",
      method: "Redirect com parâmetro partner",
      icon: "🛍️",
    },
    {
      name: "Shopee",
      tag: "Dinâmico",
      method: "Automação via console (em breve)",
      icon: "🧡",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-mute)] hover:text-[var(--color-primary)] mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Início
      </Link>

      <h1 className="text-3xl font-extrabold text-[var(--color-ink)] mb-3">
        Política de Afiliados
      </h1>
      <p className="text-[var(--color-mute)] leading-relaxed mb-10">
        Transparência total sobre como monetizamos o CrivoCerto.
      </p>

      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-[var(--color-hairline)] bg-white p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
              <DollarSign size={18} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--color-ink)]">
                Como funciona
              </h2>
              <p className="text-sm text-[var(--color-mute)] mt-1 leading-relaxed">
                O CrivoCerto participa de programas de afiliados da Amazon, Mercado Livre e
                Shopee. Quando você clica em um link de produto e faz uma compra, recebemos
                uma pequena comissão — sem custo adicional para você.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-hairline)] bg-white p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Scale size={18} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--color-ink)]">
                Impacto nas avaliações
              </h2>
              <p className="text-sm text-[var(--color-mute)] mt-1 leading-relaxed">
                <strong className="text-[var(--color-ink)]">Nenhum.</strong> Nossas notas são
                definidas antes de adicionarmos qualquer link de afiliado. Nenhuma marca paga
                para ser avaliada ou para receber uma nota melhor.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-hairline)] bg-white p-6">
          <h2 className="text-base font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">
            <ExternalLink size={16} /> Plataformas parceiras
          </h2>
          <div className="flex flex-col gap-3">
            {plataformas.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-hairline)]"
              >
                <span className="text-xl">{p.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[var(--color-ink)]">{p.name}</div>
                  <div className="text-xs text-[var(--color-mute)]">{p.method}</div>
                </div>
                <code className="text-xs bg-white border border-[var(--color-hairline)] px-2 py-0.5 rounded text-[var(--color-body)]">
                  {p.tag}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
