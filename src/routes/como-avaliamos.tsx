import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, TrendingUp, Eye, Award } from "lucide-react";

export const Route = createFileRoute("/como-avaliamos")({
  component: ComoAvaliamosPage,
});

function ComoAvaliamosPage() {
  const criterios = [
    {
      icon: Eye,
      title: "Uso real",
      description:
        "Todos os produtos são usados por pelo menos 2 semanas antes de qualquer publicação. Sem review de caixinha.",
    },
    {
      icon: ShieldCheck,
      title: "Independência editorial",
      description:
        "Nenhuma marca paga para ser avaliada. Links de afiliado são adicionados depois da nota, sem influenciar o resultado.",
    },
    {
      icon: TrendingUp,
      title: "Critérios claros",
      description:
        "Avaliamos: desempenho (40%), custo-benefício (30%), durabilidade (20%) e usabilidade (10%). A nota final é ponderada.",
    },
    {
      icon: Award,
      title: "Atualização periódica",
      description:
        "Reviews são revisados quando o fabricante lança atualizações significativas ou o preço muda consideravelmente.",
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
        Como avaliamos
      </h1>
      <p className="text-[var(--color-mute)] leading-relaxed mb-10">
        Nossa metodologia é simples: honestidade acima de tudo. Veja como funciona.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        {criterios.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-[var(--color-hairline)] bg-white p-5"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
              <Icon size={20} className="text-[var(--color-primary)]" />
            </div>
            <h3 className="text-base font-bold text-[var(--color-ink)] mb-1.5">{title}</h3>
            <p className="text-sm text-[var(--color-mute)] leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-6">
        <h2 className="text-lg font-bold text-[var(--color-ink)] mb-2">Escala de notas</h2>
        <div className="flex flex-col gap-2">
          {[
            { range: "9.0 – 10.0", label: "Excepcional — compra certa" },
            { range: "8.0 – 8.9", label: "Muito Bom — recomendado" },
            { range: "7.0 – 7.9", label: "Bom — vale o preço" },
            { range: "5.0 – 6.9", label: "Regular — compre com ressalvas" },
            { range: "< 5.0", label: "Fraco — existem opções melhores" },
          ].map(({ range, label }) => (
            <div key={range} className="flex items-center gap-3 text-sm">
              <span className="font-mono font-bold text-[var(--color-primary)] w-24 shrink-0">
                {range}
              </span>
              <span className="text-[var(--color-body)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
