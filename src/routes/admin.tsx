import { createFileRoute, Outlet, useNavigate, Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  BookOpen, 
  LogOut, 
  Settings, 
  ArrowLeft, 
  CheckCircle2, 
  User, 
  Menu, 
  X,
  TrendingUp,
  KeyRound
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      setLoading(false);

      if (!activeSession && !isLoginPage) {
        navigate({ to: "/admin/login" });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, activeSession) => {
        setSession(activeSession);
        if (!activeSession && !isLoginPage) {
          navigate({ to: "/admin/login" });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, isLoginPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-zinc-400">Verificando credenciais...</span>
        </div>
      </div>
    );
  }

  // Render Login page directly without layout wrapper
  if (isLoginPage) {
    return <Outlet />;
  }

  // If not authenticated and we are trying to access admin pages, show nothing (useEffect will redirect)
  if (!session && !isLoginPage) {
    return null;
  }

  const sidebarLinks = [
    {
      to: "/admin",
      label: "Visão Geral",
      icon: LayoutDashboard,
      activeOnlyOnExact: true,
    },
    {
      to: "/admin/posts",
      label: "Gerenciar Reviews",
      icon: BookOpen,
    },
    {
      to: "/admin/api",
      label: "Integração API",
      icon: KeyRound,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-white/5 text-zinc-300 relative overflow-hidden">
      {/* Liquid Glass Background Effects */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 -left-32 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5 relative z-10">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[#046c4e] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-white/20 backdrop-blur-md">
          <CheckCircle2 size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-black tracking-tight text-white drop-shadow-sm">
            Crivo<span className="text-[var(--color-primary)]">Certo</span>
          </span>
          <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mt-0.5">
            Admin System
          </span>
        </div>
      </div>

      {/* User Info - Glassmorphism */}
      <div className="px-5 py-5 mx-3 mt-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm relative z-10 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-white/10 text-zinc-300 shadow-md">
            <User size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-white truncate drop-shadow-sm">Administrador</p>
            <p className="text-[11px] text-zinc-400 font-medium truncate mt-0.5">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 relative z-10">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActiveRoute = link.activeOnlyOnExact 
            ? location.pathname === link.to
            : location.pathname.startsWith(link.to);

          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                isActiveRoute
                  ? "bg-gradient-to-r from-[var(--color-primary)]/15 to-transparent text-white border-l-4 border-[var(--color-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${isActiveRoute ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'bg-transparent text-zinc-500 group-hover:text-zinc-300 group-hover:bg-white/5'}`}>
                <Icon size={18} />
              </div>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-white/5 space-y-2 relative z-10 bg-zinc-950/50 backdrop-blur-md">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-300"
        >
          <div className="p-1.5 rounded-lg bg-zinc-900 text-zinc-500 border border-white/5">
            <ArrowLeft size={16} />
          </div>
          Voltar ao Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
        >
          <div className="p-1.5 rounded-lg bg-red-950/30 text-red-400 border border-red-500/10">
            <LogOut size={16} />
          </div>
          Encerrar Sessão
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-zinc-900 border-b border-zinc-800 px-4 py-3 sticky top-0 z-40">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--color-primary)] text-white">
            <CheckCircle2 size={16} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">CrivoCerto</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 h-full animate-slide-right z-40">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 md:p-10 bg-zinc-950 overflow-y-auto pt-16 md:pt-10">
        <Outlet />
      </main>
    </div>
  );
}
