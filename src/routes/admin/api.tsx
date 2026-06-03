import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { KeyRound, Plus, Trash2, Copy, CheckCircle2, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin/api")({
  component: ApiIntegrationPage,
});

interface ApiKey {
  id: string;
  key_value: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
}

function ApiIntegrationPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchKeys = async () => {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setKeys(data || []);
    } catch (err) {
      console.error("Error fetching keys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const generateKey = async () => {
    setGenerating(true);
    // Gerar um UUID v4 manual (ou usar web crypto)
    const newKey = "hrms_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    try {
      const { error } = await supabase
        .from("api_keys")
        .insert([{ key_value: newKey, name: "Hermes Agent" }]);

      if (error) throw error;
      await fetchKeys();
    } catch (err) {
      console.error("Error generating key:", err);
      alert("Erro ao gerar chave. Verifique se aplicou as migrações no banco.");
    } finally {
      setGenerating(false);
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm("Tem certeza que deseja revogar esta chave? O Hermes perderá o acesso imediatamente.")) return;
    try {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);
      if (error) throw error;
      setKeys(keys.filter(k => k.id !== id));
    } catch (err) {
      console.error("Error deleting key:", err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activeKey = keys[0]?.key_value || "NENHUMA_CHAVE_GERADA";
  
  // Pegando a URL real do projeto da variável de ambiente em vez de deixar hardcoded
  const rawSupabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "https://sqittiosnjiwfwbdcypu.supabase.co";
  const edgeFunctionUrl = `${rawSupabaseUrl}/functions/v1/hermes-gateway`;

  const systemPrompt = `Você é o Hermes, o agente IA autônomo do portal CrivoCerto.
Seu objetivo é pesquisar produtos e publicar reviews acessando a API do nosso sistema.

**Autenticação:**
Todas as suas requisições HTTP devem ser do tipo POST para o Endpoint oficial do Gateway, usando a chave abaixo.

- **Endpoint:** ${edgeFunctionUrl}
- **Header:** Authorization: Bearer ${activeKey}
- **Header:** Content-Type: application/json

**Ações Permitidas:**
Para executar ações, envie o campo "action" no corpo da requisição.

1. Ler Categorias:
{"action": "get_categories"}

2. Registrar Log (Quando iniciar um trabalho):
{"action": "log_job", "status": "running", "metadata": {"task": "pesquisando iphone"}}

3. Inserir Produto (Upsert):
{"action": "upsert_product", "payload": { "name": "...", "brand": "...", "spec_summary": "...", "pros": [], "cons": [], "affiliate_links": [], "hero_image": "..." }}

4. Inserir Guia e Linkar Produtos:
{"action": "insert_guide", "payload": { "headline": "...", "category_slug": "...", "persona_slug": "...", "context_slug": "...", "product_ids": ["uuid-1", "uuid-2"] }}`;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="border-b border-zinc-900 pb-5">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <KeyRound className="text-[var(--color-primary)]" size={32} />
          Integração API (Hermes)
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Gerencie o acesso seguro do seu Agente Autônomo ao banco de dados usando a Edge Function Gateway.
        </p>
      </div>

      {/* Warning Box */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex gap-4 items-start shadow-lg shadow-black/20">
        <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={24} />
        <div>
          <h4 className="text-amber-500 font-bold">Segurança Máxima</h4>
          <p className="text-amber-500/80 text-sm mt-1 leading-relaxed">
            Nunca entregue a Service Role Key do seu banco de dados para a IA. Gere chaves dinâmicas abaixo. O Gateway atuará como escudo, permitindo apenas que o Hermes execute as funções pré-programadas de criar posts e ler categorias.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Key Management */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Chaves de Acesso</h3>
            <button
              onClick={generateKey}
              disabled={generating}
              className="flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-bold bg-[var(--color-primary)] text-zinc-950 hover:bg-emerald-400 transition-all shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-50"
            >
              <Plus size={16} />
              {generating ? "Gerando..." : "Nova Chave"}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-10 bg-zinc-950/50 rounded-2xl border border-zinc-800 border-dashed">
              <KeyRound className="mx-auto text-zinc-600 mb-2" size={24} />
              <p className="text-zinc-500 text-sm">Nenhuma chave gerada.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((key) => (
                <div key={key.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between group">
                  <div>
                    <h4 className="text-white font-bold text-sm">{key.name}</h4>
                    <code className="text-xs text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded mt-1 inline-block">
                      {key.key_value}
                    </code>
                    <p className="text-[10px] text-zinc-500 mt-2">
                      Criada em: {new Date(key.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyToClipboard(key.key_value, key.id)}
                      className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Copiar Chave"
                    >
                      {copiedKey === key.id ? <CheckCircle2 className="text-emerald-500" size={16} /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={() => deleteKey(key.id)}
                      className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors"
                      title="Revogar Chave"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Prompt Generator */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg shadow-black/30 flex flex-col">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
            <div>
              <h3 className="text-lg font-bold text-white">Prompt do Sistema (Hermes)</h3>
              <p className="text-xs text-zinc-500 mt-1">Copie e cole isso no cérebro da sua IA.</p>
            </div>
            <button
              onClick={() => copyToClipboard(systemPrompt, "prompt")}
              className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              {copiedKey === "prompt" ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-500" /> Copiado!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copiar Prompt
                </>
              )}
            </button>
          </div>
          <div className="p-6 flex-1 bg-zinc-950 font-mono text-xs text-zinc-400 overflow-y-auto relative">
            {keys.length === 0 && (
              <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center">
                <p className="text-white font-bold bg-zinc-900 px-4 py-2 rounded-full border border-zinc-700">
                  Gere uma chave primeiro!
                </p>
              </div>
            )}
            <pre className="whitespace-pre-wrap leading-relaxed">{systemPrompt}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
