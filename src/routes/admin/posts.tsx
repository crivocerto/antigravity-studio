import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getAdminGuides } from "@/data/posts";
import type { AdminGuide } from "@/data/posts";
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  Eye, 
  Calendar, 
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Package,
  Layers
} from "lucide-react";

export const Route = createFileRoute("/admin/posts")({
  component: AdminPosts,
});

function AdminPosts() {
  const [guides, setGuides] = useState<AdminGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Accordion state
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);
  const [guideProducts, setGuideProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchGuides = async () => {
    setRefreshing(true);
    try {
      const data = await getAdminGuides();
      setGuides(data);
    } catch (err) {
      console.error("Error fetching guides:", err);
      setGuides([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleGenerateAI = async () => {
    setGenerating(true);
    setMessage(null);
    try {
      // Endpoint trigger for autonomous generation (simulacao)
      setMessage({
        type: "success",
        text: "Agente IA acionado! O Guia está sendo gerado via Edge Function.",
      });
      // Simulando tempo
      setTimeout(() => fetchGuides(), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: "Falha ao conectar com o endpoint." });
    } finally {
      setGenerating(false);
    }
  };

  const toggleGuide = async (guideId: string) => {
    if (expandedGuideId === guideId) {
      setExpandedGuideId(null);
      return;
    }
    
    setExpandedGuideId(guideId);
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('guide_products')
        .select('*, products(*)')
        .eq('guide_id', guideId)
        .order('position', { ascending: true });
        
      if (!error && data) {
        setGuideProducts(data);
      }
    } catch (err) {
      console.error("Erro carregando produtos", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDeleteGuide = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este Guia e seus vínculos? Esta ação é irreversível.")) return;
    
    setMessage(null);
    const previous = [...guides];
    setGuides(prev => prev.filter(g => g.id !== id));
    
    const { error } = await supabase.from('guides').delete().eq('id', id);
    
    if (!error) {
      setMessage({ type: "success", text: "Guia removido definitivamente do banco de dados." });
    } else {
      setGuides(previous);
      setMessage({ type: "error", text: "Erro ao excluir o guia." });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
      {/* Header Liquid Glass */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <Layers className="text-emerald-500" size={32} />
            Gerenciamento de Conteúdo
          </h1>
          <p className="text-sm text-zinc-400 mt-2">Guias e Produtos Rankeados (Programmatic SEO)</p>
        </div>

        <div className="flex items-center gap-3 self-start">
          <button
            onClick={fetchGuides}
            disabled={refreshing}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50"
            title="Sincronizar"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          </button>
          
          <button
            onClick={handleGenerateAI}
            disabled={generating}
            className="flex items-center gap-2 py-3 px-5 rounded-2xl text-xs font-black uppercase tracking-wider bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Sparkles size={16} />
            {generating ? "Processando..." : "Testar IA Local"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`flex gap-3 p-5 rounded-2xl border animate-slide-up shadow-2xl backdrop-blur-xl ${
            message.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
          {message.type === "success" ? <CheckCircle2 size={20} className="shrink-0" /> : <AlertTriangle size={20} className="shrink-0" />}
          <span className="text-sm font-bold">{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-32 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      ) : guides.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800 border-dashed">
          <Layers className="mx-auto text-zinc-600 mb-4" size={48} />
          <p className="text-zinc-500 font-medium">Nenhum guia encontrado na nova arquitetura.</p>
        </div>
      ) : (
        /* Guides Bento Accordion List */
        <div className="space-y-4">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl transition-all">
              {/* Accordion Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                onClick={() => toggleGuide(guide.id)}
              >
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white">{guide.headline}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-xs font-bold uppercase tracking-wider bg-zinc-950 px-3 py-1 rounded-full text-zinc-400 border border-zinc-800">
                      {guide.category_slug}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider bg-zinc-950 px-3 py-1 rounded-full text-zinc-400 border border-zinc-800">
                      {guide.persona_slug}
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1.5 ml-2">
                      <Calendar size={12} /> {new Date(guide.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-2xl border border-emerald-500/20 text-xs font-black uppercase">
                    <Package size={14} />
                    {guide.products_count} Produtos
                  </span>
                  
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <a
                      href={`/${guide.category_slug}/${guide.persona_slug}/${guide.context_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                      title="Visualizar"
                    >
                      <Eye size={16} />
                    </a>
                    <button
                      onClick={() => handleDeleteGuide(guide.id)}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 pointer-events-none"
                    >
                      {expandedGuideId === guide.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Accordion Body (Products) */}
              {expandedGuideId === guide.id && (
                <div className="border-t border-zinc-800 bg-zinc-950/50 p-6 animate-slide-up">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Rankings Gerados pela IA</h4>
                  
                  {loadingProducts ? (
                    <div className="py-10 flex justify-center"><div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" /></div>
                  ) : guideProducts.length === 0 ? (
                    <div className="text-sm text-zinc-500 py-4">Nenhum produto associado a este guia.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {guideProducts.map((gp, idx) => (
                        <div key={gp.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                          <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-300 text-[10px] font-black px-3 py-1 rounded-bl-xl z-10">
                            #{gp.position || idx + 1}
                          </div>
                          <div className="w-full h-32 bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800">
                            {gp.products?.hero_image ? (
                              <img src={gp.products.hero_image} alt="hero" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600"><Package size={24} /></div>
                            )}
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-white line-clamp-1">{gp.products?.name || 'Sem nome'}</h5>
                            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 font-medium">
                              {gp.products?.brand}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-2 line-clamp-2">
                              {gp.products?.spec_summary}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
