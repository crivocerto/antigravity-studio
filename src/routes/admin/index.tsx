import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  TrendingUp, 
  MousePointerClick, 
  Eye, 
  RefreshCw, 
  ExternalLink,
  Laptop,
  Calendar,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign
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

function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [clicks, setClicks] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTelemetry = async () => {
    setRefreshing(true);
    try {
      // 1. Fetch Aggregated Metrics via RPC
      const { data: metricsData, error: metricsError } = await supabase.rpc("get_admin_dashboard_metrics");
      
      if (metricsError) {
        console.error("Error fetching metrics:", metricsError);
        setMetrics({
          total_views: 0,
          total_clicks: 0,
          global_ctr: 0,
          platforms: { amazon: 0, mercadolivre: 0, shopee: 0 }
        });
      } else if (metricsData) {
        setMetrics(metricsData);
      }

      // 2. Fetch Recent Clicks
      const { data: clicksData } = await supabase
        .from("clicks_tracking")
        .select(`
          id, platform, affiliate_url, user_agent, created_at,
          posts ( title )
        `)
        .order("created_at", { ascending: false })
        .limit(10);
      
      setClicks(clicksData || []);

      // 3. Fetch Recent Jobs
      const { data: jobsData } = await supabase
        .from("agent_jobs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(5);

      setJobs(jobsData || []);
      
    } catch (err) {
      console.error("Error fetching telemetry:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Mock de dados para o gráfico de performance de 7 dias (pois o banco real requer agregações diárias)
  const chartData = [
    { date: "Seg", amazon: 120, mercadolivre: 45, shopee: 20 },
    { date: "Ter", amazon: 132, mercadolivre: 50, shopee: 22 },
    { date: "Qua", amazon: 101, mercadolivre: 40, shopee: 15 },
    { date: "Qui", amazon: 145, mercadolivre: 60, shopee: 30 },
    { date: "Sex", amazon: 190, mercadolivre: 80, shopee: 45 },
    { date: "Sáb", amazon: 250, mercadolivre: 110, shopee: 60 },
    { date: "Dom", amazon: 210, mercadolivre: 90, shopee: 50 },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Dashboard de Conversão</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Programmatic SEO Telemetry & Affiliate Tracking (CrivoCerto v3)
          </p>
        </div>
        <button
          onClick={fetchTelemetry}
          disabled={refreshing}
          className="flex items-center gap-2 self-start py-2.5 px-5 rounded-xl text-xs font-black uppercase tracking-wider bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Sincronizando..." : "Sincronizar"}
        </button>
      </div>

      {loading ? (
        <div className="py-32 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* Bento Grid - Liquid Glass KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* Main KPI: CTR Global (Ocupa 2 colunas) */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl relative overflow-hidden group hover:translate-y-[-4px] transition-transform shadow-2xl">
              <div className="absolute right-6 top-6 text-teal-400/20 group-hover:text-teal-400/40 transition-colors">
                <TrendingUp size={80} strokeWidth={1} />
              </div>
              <span className="block text-xs font-black uppercase tracking-widest text-teal-400">CTR Geral (Click-Through Rate)</span>
              <h2 className="text-6xl md:text-7xl font-black text-white mt-4 tracking-tighter">
                {metrics?.global_ctr}%
              </h2>
              <div className="mt-6 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 font-bold uppercase">Page Views</span>
                  <span className="text-xl text-zinc-300 font-bold flex items-center gap-2">
                    <Eye size={16} className="text-zinc-500" /> {metrics?.total_views}
                  </span>
                </div>
                <div className="flex flex-col border-l border-white/10 pl-6">
                  <span className="text-xs text-zinc-500 font-bold uppercase">Cliques Saída</span>
                  <span className="text-xl text-zinc-300 font-bold flex items-center gap-2">
                    <MousePointerClick size={16} className="text-zinc-500" /> {metrics?.total_clicks}
                  </span>
                </div>
              </div>
            </div>

            {/* KPI: Estimativa de Receita */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl relative overflow-hidden group hover:translate-y-[-4px] transition-transform">
              <div className="absolute right-4 top-4 text-emerald-400/20 group-hover:text-emerald-400/40 transition-colors">
                <DollarSign size={64} strokeWidth={1} />
              </div>
              <span className="block text-xs font-black uppercase tracking-widest text-emerald-400">Receita Estimada</span>
              <h2 className="text-5xl font-black text-white mt-4 tracking-tighter">
                <span className="text-2xl text-zinc-500 mr-1">R$</span>
                {Math.round((metrics?.total_clicks || 0) * 0.45).toLocaleString()}
              </h2>
              <p className="text-xs text-zinc-500 mt-4 font-medium">
                *Projeção baseada num EPC médio de R$ 0,45 por clique.
              </p>
            </div>

            {/* Split Market Share */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl flex flex-col gap-4 group hover:translate-y-[-4px] transition-transform">
              <span className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Split de Tráfego</span>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-500">Amazon</span>
                <span className="text-lg font-black text-white">{metrics?.platforms?.amazon}</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1.5">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(metrics?.platforms?.amazon / (metrics?.total_clicks || 1)) * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-yellow-400">Mercado Livre</span>
                <span className="text-lg font-black text-white">{metrics?.platforms?.mercadolivre}</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1.5">
                <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${(metrics?.platforms?.mercadolivre / (metrics?.total_clicks || 1)) * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-orange-500">Shopee</span>
                <span className="text-lg font-black text-white">{metrics?.platforms?.shopee}</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1.5">
                <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(metrics?.platforms?.shopee / (metrics?.total_clicks || 1)) * 100}%` }}></div>
              </div>
            </div>

          </div>

          {/* Gráfico de Performance (Liquid Glass Container) */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl mt-6">
            <h3 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4">Desempenho de Cliques (Últimos 7 Dias)</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmazon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorML" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorShopee" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(24, 24, 27, 0.9)", backdropFilter: "blur(8px)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "1rem" }}
                    labelStyle={{ color: "#fff", fontWeight: "bold", marginBottom: "8px" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: "20px" }} />
                  <Area type="monotone" dataKey="amazon" name="Amazon" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorAmazon)" />
                  <Area type="monotone" dataKey="mercadolivre" name="Mercado Livre" stroke="#facc15" strokeWidth={3} fillOpacity={1} fill="url(#colorML)" />
                  <Area type="monotone" dataKey="shopee" name="Shopee" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorShopee)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Agent Jobs Monitor (Hermes Status) */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Monitor IA (Hermes)</h3>
                    <p className="text-xs text-zinc-400">Trabalhos autônomos de Programmatic SEO</p>
                  </div>
                </div>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                </span>
              </div>
              
              <div className="divide-y divide-white/5 flex-1 p-2">
                {jobs.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 text-sm font-medium">
                    Nenhuma atividade do agente registrada.
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div key={job.id} className="p-4 rounded-2xl hover:bg-white/5 transition-colors m-2 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {job.status === "running" && <Clock className="text-blue-400 animate-spin-slow" size={20} />}
                        {job.status === "success" && <CheckCircle2 className="text-teal-400" size={20} />}
                        {job.status === "failed" && <XCircle className="text-red-400" size={20} />}
                        
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-2">
                            {job.action}
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                              job.status === "running" ? "bg-blue-500/20 text-blue-300" :
                              job.status === "success" ? "bg-teal-500/20 text-teal-300" :
                              "bg-red-500/20 text-red-300"
                            }`}>
                              {job.status}
                            </span>
                          </p>
                          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                            <Calendar size={12} />
                            {new Date(job.started_at).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Log de Cliques Recentes */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/30">
                <h3 className="text-lg font-bold text-white">Live Click Feed</h3>
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-zinc-300">
                  Top 10 Recentes
                </span>
              </div>
              
              <div className="overflow-x-auto flex-1 p-2">
                <table className="w-full text-left text-sm text-zinc-300 border-separate border-spacing-y-2 px-2">
                  <tbody className="">
                    {clicks.length === 0 ? (
                      <tr>
                        <td className="p-12 text-center text-zinc-500">Nenhum clique registrado.</td>
                      </tr>
                    ) : (
                      clicks.map((click) => {
                        const platColor = 
                          click.platform === "amazon" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" : 
                          click.platform === "mercadolivre" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" : 
                          "text-orange-500 bg-orange-500/10 border-orange-500/20";
                        
                        return (
                          <tr key={click.id} className="bg-white/5 hover:bg-white/10 transition-colors group">
                            <td className="p-4 rounded-l-2xl font-bold text-white max-w-[200px] truncate">
                              {click.posts?.title || "Produto Não Encontrado"}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${platColor}`}>
                                {click.platform}
                              </span>
                            </td>
                            <td className="p-4 text-zinc-400 text-xs hidden sm:table-cell">
                              {new Date(click.created_at).toLocaleTimeString("pt-BR")}
                            </td>
                            <td className="p-4 text-right rounded-r-2xl">
                              <a 
                                href={click.affiliate_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex p-2 rounded-xl bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-all"
                              >
                                <ExternalLink size={14} />
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
