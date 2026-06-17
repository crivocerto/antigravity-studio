const fs = require('fs');

let content = fs.readFileSync('src/routes/admin/posts.tsx', 'utf8');

// 1. Add deletePost import
content = content.replace(
  'import { getPosts } from "@/data/posts";',
  'import { getPosts, deletePost } from "@/data/posts";'
);

// 2. Replace handleGenerateAI mock
const generateAIOld = `      if (response.ok) {
        setMessage({
          type: "success",
          text: "Agente IA acionado! O review está sendo gerado em segundo plano.",
        });
        setTimeout(() => fetchPosts(), 3000);
      } else {
        // Mock success for client-side demonstration if server function is not locally hosted yet
        setMessage({
          type: "success",
          text: "Automação acionada (Modo de Demonstração)! Novo review de 'Smart TV LG C3 OLED' adicionado com sucesso.",
        });
        
        // Add a mock post to show it in the list immediately
        const mockNewPost: Post = {
          id: \`new-\${Date.now()}\`,
          slug: "smart-tv-lg-oled-c3-review",
          title: "LG OLED C3: A melhor Smart TV gamer do mercado em 2026",
          excerpt: "Testamos a queridinha dos gamers e entusiastas de cinema por duas semanas. Vale o preço premium?",
          content: "Conteúdo completo gerado por inteligência artificial...",
          category: { id: "eletronicos", name: "Eletrônicos", slug: "eletronicos", icon: "Cpu", description: "" },
          tags: ["smart tv", "lg", "oled", "gamer"],
          rating: 9.6,
          pros: ["Qualidade de imagem OLED absurda", "4 portas HDMI 2.1", "Interface webOS rápida"],
          cons: ["Preço elevado", "Brilho máximo menor que modelos MiniLED"],
          affiliateLinks: [{ platform: "amazon", url: "https://amazon.com.br", price: 5499.00 }],
          heroImage: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80",
          publishedAt: new Date().toISOString().split("T")[0]!,
          readingTime: 6,
          featured: false,
        } as unknown as Post;
        
        setPostsList(prev => [mockNewPost, ...prev]);
      }`;

const generateAINew = `      if (response.ok) {
        setMessage({
          type: "success",
          text: "Agente IA acionado! O review está sendo gerado em segundo plano.",
        });
        setTimeout(() => fetchPosts(), 3000);
      } else {
        const errorText = await response.text();
        throw new Error(\`Erro na API (\${response.status}): \${errorText || "Endpoint inacessível."}\`);
      }`;

content = content.replace(generateAIOld, generateAINew);

// 3. Replace handleDeletePost local mock
const deleteOld = `  const handleDeletePost = (id: string) => {
    setPostsList(prev => prev.filter(p => p.id !== id));
    setMessage({
      type: "success",
      text: "Review removido com sucesso (alteração local).",
    });
  };`;

const deleteNew = `  const handleDeletePost = async (id: string) => {
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
  };`;

content = content.replace(deleteOld, deleteNew);

fs.writeFileSync('src/routes/admin/posts.tsx', content);
console.log('Update complete!');
