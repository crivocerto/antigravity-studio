import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getPosts, deletePost } from "@/data/posts";
import type { Post } from "@/data/posts";
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  Eye, 
  Calendar, 
  Star,
  RefreshCw,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/admin/posts")({
  component: AdminPosts,
});

function AdminPosts() {
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchPosts = async () => {
    setRefreshing(true);
    try {
      const data = await getPosts();
      setPostsList(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPostsList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleGenerateAI = async () => {
    setGenerating(true);
    setMessage(null);
    try {
      // Endpoint trigger for autonomous generation
      const response = await fetch("/api/cron/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer CRON_SECRET_DEV_KEY",
        },
        body: JSON.stringify({ category: "eletronicos" }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Agente IA acionado! O review está sendo gerado em segundo plano.",
        });
        setTimeout(() => fetchPosts(), 3000);
      } else {
        const errorText = await response.text();
        throw new Error(`Erro na API (${response.status}): ${errorText || "Endpoint inacessível."}`);
      }
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Falha ao conectar com o endpoint do Agente de IA.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Tem certeza absoluta que deseja excluir este review? Esta ação é irreversível.")) return;
    
    setMessage(null);
    const previousPosts = [...postsList];
    setPostsList(prev => prev.filter(p => p.id !== id));
    
    const result = await deletePost(id);
    
    if (result.success) {
      setMessage({ type: "success", text: "Review removido definitivamente do banco de dados." });
    } else {
      setPostsList(previousPosts);
      setMessage({ type: "error", text: "Erro ao excluir o post. Tente novamente." });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Gerenciamento de Reviews</h1>
          <p className="text-sm text-zinc-400 mt-1">Publique, edite e acompanhe os reviews gerados por IA ou manuais</p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={fetchPosts}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850 transition-all disabled:opacity-50"
            title="Sincronizar"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          </button>
          
          <button
            onClick={handleGenerateAI}
            disabled={generating}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/10 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Sparkles size={14} />
            {generating ? "Gerando..." : "Gerar via IA"}
          </button>

          <button
            onClick={() => setMessage({ type: "success", text: "Editor manual em desenvolvimento!" })}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 active:scale-[0.98] transition-all"
          >
            <Plus size={14} />
            Novo Review
          </button>
        </div>
      </div>

      {/* Notifications/Feedback */}
      {message && (
        <div
          className={`flex gap-3 p-4 rounded-2xl border animate-slide-up ${
            message.type === "success"
              ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-400"
              : "bg-red-950/20 border-red-900/50 text-red-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
          <span className="text-sm font-semibold">{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
        </div>
      ) : (
        /* Posts Table */
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg shadow-black/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/40 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Review</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Avaliação</th>
                  <th className="px-6 py-4">Data Publicação</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {postsList.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-850/30 transition-colors">
                    {/* Title & Excerpt */}
                    <td className="px-6 py-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.heroImage} 
                          alt={post.title} 
                          className="w-10 h-10 rounded-lg object-cover border border-zinc-800 shrink-0" 
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{post.title}</p>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-xs bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full text-zinc-400 font-medium">
                        {post.category.name}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-white font-semibold">
                        <Star size={13} fill="#0d9a6e" className="text-[var(--color-primary)]" />
                        {post.rating.toFixed(1)}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-zinc-400 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Publicado
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/review/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={15} />
                        </a>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
