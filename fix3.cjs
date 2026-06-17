const fs = require('fs');

let content = fs.readFileSync('src/routes/admin/posts.tsx', 'utf8');

// 1. Replace handleDeletePost
content = content.replace(
  /const handleDeletePost = \(id: string\) => \{[\s\S]*?text: "Review removido com sucesso \(alteração local\)\.",\s*\}\);\s*\};/g,
  `const handleDeletePost = async (id: string) => {
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
  };`
);

// 2. Replace handleGenerateAI 
content = content.replace(
  /\/\/\s*Mock success for client-side demonstration[\s\S]*?setPostsList\(prev => \[mockNewPost, \.\.\.prev\]\);\s*\}/g,
  `const errorText = await response.text();
        throw new Error(\`Erro na API (\${response.status}): \${errorText || "Endpoint inacessível."}\`);
      }`
);

fs.writeFileSync('src/routes/admin/posts.tsx', content);
console.log("Updated posts.tsx!");
