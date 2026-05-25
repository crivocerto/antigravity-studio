import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { POSTS } from "@/data/posts";
import { 
  TrendingUp, 
  MousePointerClick, 
  ShoppingBag, 
  RefreshCw, 
  ExternalLink,
  Laptop,
  Calendar,
  Activity,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

interface ClickRecord {
  id: string;
  post_id: string;
  platform: "amazon" | "mercadolivre" | "shopee";
  affiliate_url: string;
  user_agent: string | null;
  created_at: string;
}

interface AgentJob {
  id: string;
  started_at: string;
  completed_at: string | null;
  status: "running" | "success" | "failed";
  action: string;
  metadata: any;
}

function AdminDashboard() {
  const [clicks, setClicks] = useState<ClickRecord[]>([]);
  const [jobs, setJobs] = useState<AgentJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTelemetry = async () => {
    setRefreshing(true);
    try {
      const { data: clicksData, error: clicksError } = await supabase
        .from("clicks_tracking")
        .select("*")
        .order("created_at", { ascending: false });

      if (clicksError) throw clicksError;
      setClicks(clicksData || []);

      const { data: jobsData, error: jobsError } = await supabase
        .from("agent_jobs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(5);

      if (jobsError) console.error("Error fetching agent jobs:", jobsError);
      else setJobs(jobsData || []);
    } catch (err) {
      console.error("Error fetching telemetry:", err);
      // Removemos o fallback de mock; dashboard ficará zerado caso não haja dados reais.
      setClicks([]);
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Aggregated calculations
  const totalClicks = clicks.length;
  const amazonClicks = clicks.filter(c => c.platform === "amazon").length;
  const mercadolivreClicks = clicks.filter(c => c.platform === "mercadolivre").length;
  const shopeeClicks = clicks.filter(c => c.platform === "shopee").length;

  // Chart data aggregation (last 7 days)
  const getChartData = () => {
    const days: Record<string, { date: string; amazon: number; mercadolivre: number; shopee: number }> = {};
    const now = new Date();

    // Init last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const label = d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
      const key = d.toDateString();
      days[key] = { date: label, amazon: 0, mercadolivre: 0, shopee: 0 };
    }

    // Populate
    clicks.forEach(c => {
      const key = new Date(c.created_at).toDateString();
      if (days[key]) {
        days[key]![c.platform]++;
      }
    });

    return Object.values(days);
  };

  const chartData = getChartData();

  // Find post title helper
  const getPostTitle = (postId: string) => {
    const post = POSTS.find(p => p.id === postId || p.slug === postId);
    return post ? post.title : "Produto Externo / Deletado";
  };

  // Platform badges
  const platformConfig = {
    amazon: { label: "Amazon", color: "bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/25" },
    mercadolivre: { label: "Mercado Livre", color: "bg-[#FFE600]/10 text-[#FFC700] border-[#FFE600]/25" },
    shopee: { label: "Shopee", color: "bg-[#EE4D2D]/10 text-[#EE4D2D] border-[#EE4D2D]/25" },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Métricas de Conversão</h1>
          <p className="text-sm text-zinc-400 mt-1">Acompanhe cliques nos links de afiliados e telemetria de compra</p>
        </div>
        <button
          onClick={fetchTelemetry}
          disabled={refreshing}
          className="flex items-center gap-2 self-start py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Dashboard cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Clicks */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-black/30">
              <div className="absolute right-4 top-4 text-zinc-800 select-none">
                <MousePointerClick size={48} strokeWidth={1} />
              </div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-zinc-500">Cliques Totais</span>
              <h2 className="text-4xl font-extrabold text-white mt-2 leading-none">{totalClicks}</h2>
              <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1">
                <TrendingUp size={12} />
                +14.2% esta semana
              </p>
            </div>

            {/* Amazon Clicks */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-black/30">
              <div className="absolute right-4 top-4 text-[#FF9900]/10 select-none">
                <ShoppingBag size={48} strokeWidth={1} />
              </div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-[#FF9900]">Amazon BR</span>
              <h2 className="text-4xl font-extrabold text-white mt-2 leading-none">{amazonClicks}</h2>
              <span className="text-xs text-zinc-500 block mt-3">
                {totalClicks > 0 ? Math.round((amazonClicks / totalClicks) * 100) : 0}% de market share
              </span>
            </div>

            {/* Mercado Livre Clicks */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-black/30">
              <div className="absolute right-4 top-4 text-[#FFE600]/5 select-none">
                <ShoppingBag size={48} strokeWidth={1} />
              </div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-[#FFC700]">Mercado Livre</span>
              <h2 className="text-4xl font-extrabold text-white mt-2 leading-none">{mercadolivreClicks}</h2>
              <span className="text-xs text-zinc-500 block mt-3">
                {totalClicks > 0 ? Math.round((mercadolivreClicks / totalClicks) * 100) : 0}% de market share
              </span>
            </div>

            {/* Shopee Clicks */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-black/30">
              <div className="absolute right-4 top-4 text-[#EE4D2D]/10 select-none">
                <ShoppingBag size={48} strokeWidth={1} />
              </div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-[#EE4D2D]">Shopee BR</span>
              <h2 className="text-4xl font-extrabold text-white mt-2 leading-none">{shopeeClicks}</h2>
              <span className="text-xs text-zinc-500 block mt-3">
                {totalClicks > 0 ? Math.round((shopeeClicks / totalClicks) * 100) : 0}% de market share
              </span>
            </div>
          </div>

          {/* Area Chart Section */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-lg shadow-black/30">
            <h3 className="text-base font-bold text-white mb-6">Volume de Conversão por Canal</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmazon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF9900" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#FF9900" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorML" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFC700" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#FFC700" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorShopee" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EE4D2D" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#EE4D2D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "1rem" }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="amazon" name="Amazon" stroke="#FF9900" strokeWidth={2} fillOpacity={1} fill="url(#colorAmazon)" />
                  <Area type="monotone" dataKey="mercadolivre" name="Mercado Livre" stroke="#FFC700" strokeWidth={2} fillOpacity={1} fill="url(#colorML)" />
                  <Area type="monotone" dataKey="shopee" name="Shopee" stroke="#EE4D2D" strokeWidth={2} fillOpacity={1} fill="url(#colorShopee)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Agent Jobs Monitor */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg shadow-black/30">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Monitor Autônomo (Hermes)</h3>
                  <p className="text-xs text-zinc-400">Últimos processos executados pelo agente IA</p>
                </div>
              </div>
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[var(--color-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-primary)]"></span>
              </span>
            </div>
            
            <div className="divide-y divide-zinc-850">
              {jobs.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  Nenhuma atividade do agente registrada ainda.
                </div>
              ) : (
                jobs.map((job) => {
                  const isRunning = job.status === "running";
                  const isSuccess = job.status === "success";
                  const isFailed = job.status === "failed";
                  const startDate = new Date(job.started_at);
                  
                  return (
                    <div key={job.id} className="p-4 flex items-center justify-between hover:bg-zinc-850/30 transition-colors">
                      <div className="flex items-center gap-4">
                        {isRunning && <Clock className="text-blue-400 animate-pulse" size={20} />}
                        {isSuccess && <CheckCircle2 className="text-emerald-500" size={20} />}
                        {isFailed && <XCircle className="text-red-500" size={20} />}
                        
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-2">
                            {job.action}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                              isRunning ? "bg-blue-500/10 text-blue-400" :
                              isSuccess ? "bg-emerald-500/10 text-emerald-400" :
                              "bg-red-500/10 text-red-400"
                            }`}>
                              {job.status}
                            </span>
                          </p>
                          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                            <Calendar size={12} />
                            {startDate.toLocaleDateString("pt-BR")} às {startDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <pre className="text-[10px] text-zinc-500 bg-zinc-950 p-2 rounded-lg max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                          {JSON.stringify(job.metadata)}
                        </pre>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Table of Recent Clicks */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg shadow-black/30">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Log de Cliques Recentes</h3>
              <span className="text-xs bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full text-zinc-400 font-semibold">
                Mostrando {clicks.slice(0, 10).length} itens
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/40 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">Review do Produto</th>
                    <th className="px-6 py-4">Plataforma</th>
                    <th className="px-6 py-4">Data / Hora</th>
                    <th className="px-6 py-4">Device</th>
                    <th className="px-6 py-4 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {clicks.slice(0, 10).map((click) => {
                    const plat = platformConfig[click.platform] || { label: click.platform, color: "bg-zinc-800 text-zinc-400" };
                    const date = new Date(click.created_at);
                    
                    // Simple OS parser from user agent
                    let os = "Desktop";
                    if (click.user_agent) {
                      if (click.user_agent.includes("iPhone") || click.user_agent.includes("iPad")) os = "iOS";
                      else if (click.user_agent.includes("Android")) os = "Android";
                      else if (click.user_agent.includes("Macintosh")) os = "macOS";
                      else if (click.user_agent.includes("Windows")) os = "Windows";
                    }

                    return (
                      <tr key={click.id} className="hover:bg-zinc-850/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-white max-w-xs truncate">
                          {getPostTitle(click.post_id)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold border ${plat.color}`}>
                            {plat.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-1.5 text-zinc-400 text-xs">
                          <Calendar size={13} />
                          {date.toLocaleDateString("pt-BR")} às {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-6 py-4 text-zinc-400 text-xs">
                          <span className="flex items-center gap-1">
                            <Laptop size={13} />
                            {os}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a 
                            href={click.affiliate_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex text-[var(--color-primary)] hover:text-white transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
