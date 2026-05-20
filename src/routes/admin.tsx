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
  TrendingUp
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
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800 text-zinc-300">
      {/* Brand Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-zinc-800">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--color-primary)] text-white shadow-md">
          <CheckCircle2 size={18} strokeWidth={2.5} />
        </div>
        <span className="text-base font-extrabold tracking-tight text-white">
          Crivo<span className="text-[var(--color-primary)] font-black">Certo</span>
        </span>
        <span className="text-[9px] font-bold bg-zinc-800 text-[var(--color-primary)] border border-zinc-700 px-1.5 py-0.5 rounded-full uppercase ml-1">
          Admin
        </span>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 flex items-center gap-3 border-b border-zinc-850 bg-zinc-900/40">
        <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-zinc-300 shrink-0">
          <User size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">Administrador</p>
          <p className="text-[10px] text-zinc-500 truncate mt-0.5">{session?.user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all duration-200 ${
                isActiveRoute
                  ? "bg-[var(--color-primary)]/10 text-white border-l-4 border-[var(--color-primary)]"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon size={16} className={isActiveRoute ? "text-[var(--color-primary)]" : ""} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-zinc-800 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
        >
          <LogOut size={16} />
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
