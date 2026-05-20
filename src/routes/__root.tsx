import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold" style={{ color: "var(--color-ink)" }}>
          404
        </h1>
        <h2 className="mt-4 text-xl font-semibold" style={{ color: "var(--color-ink)" }}>
          Página não encontrada
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--color-mute)" }}>
          O review que você procura não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  notFoundComponent: NotFoundComponent,
  component: RootComponent,
});

function RootComponent() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

