import { supabase } from "@/lib/supabase";

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
};

export type AffiliateLink = {
  platform: "amazon" | "mercadolivre" | "shopee";
  url: string;
  price?: number;
  label?: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category_id: string;
  category: Category; // sempre populado pelo mapper
  tags: string[];
  rating: number; // 0–10
  pros: string[];
  cons: string[];
  affiliate_links: AffiliateLink[];
  hero_image: string;
  published_at: string;
  reading_time: number; // minutos
  featured: boolean;
  status: string;
  // Aliases camelCase produzidos pelo mapper
  heroImage: string;
  readingTime: number;
  publishedAt: string;
  affiliateLinks: AffiliateLink[];
};

const mapPost = (dbPost: any): Post => {
  // Se for o nosso post fake de erro, apenas retornar
  if (dbPost.id === "error") return dbPost as Post;

  let parsedContent = null;
  if (dbPost.content && typeof dbPost.content === "string" && dbPost.content.trim().startsWith("{")) {
    try {
      parsedContent = JSON.parse(dbPost.content);
    } catch (e) {
      // Ignora, é markdown padrão
    }
  }

  const contentString = parsedContent?.body || parsedContent?.texto || dbPost.content || "";
  let excerpt = dbPost.excerpt;
  if (!excerpt && contentString) {
    excerpt = contentString.substring(0, 150) + "...";
  }

  let rating = parsedContent?.crivo_meter ? (parsedContent.crivo_meter / 10) : (dbPost.rating || 0);
  let pros = parsedContent?.pros || dbPost.pros || [];
  let cons = parsedContent?.cons || dbPost.cons || [];
  let affiliateLinks = dbPost.affiliate_links || dbPost.affiliateLinks || [];
  
  // AI NLP Recovery - Extrair dados via Regex caso a IA tenha retornado um blocão de texto
  if (contentString) {
    if (rating === 0) {
      const ratingMatch = contentString.match(/Nota[^:]*?:\s*(\d+(?:\.\d+)?)\/10/i);
      if (ratingMatch && ratingMatch[1]) rating = parseFloat(ratingMatch[1]);
    }
    if (pros.length === 0) {
      const prosSection = contentString.match(/\*\*Pr[oó]s:\*\*([\s\S]*?)(?=\*\*Contras:\*\*|##|$)/i);
      if (prosSection && prosSection[1]) {
        pros = prosSection[1].split('\n').filter((l: string) => l.trim().startsWith('-')).map((l: string) => l.replace(/^-\s*/, '').trim());
      }
    }
    if (cons.length === 0) {
      const consSection = contentString.match(/\*\*Contras:\*\*([\s\S]*?)(?=\*\*|##|$)/i);
      if (consSection && consSection[1]) {
        cons = consSection[1].split('\n').filter((l: string) => l.trim().startsWith('-')).map((l: string) => l.replace(/^-\s*/, '').trim());
      }
    }
    if (affiliateLinks.length === 0) {
      const linksSection = contentString.match(/## Onde Comprar[\s\S]*?(?=(##|$))/i);
      if (linksSection && linksSection[0]) {
        const linkMatches = [...linksSection[0].matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
        if (linkMatches.length > 0) {
          affiliateLinks = linkMatches.map(m => {
            let platform = "other";
            if (m[1].toLowerCase().includes("amazon")) platform = "amazon";
            else if (m[1].toLowerCase().includes("mercado livre") || m[1].toLowerCase().includes("meli")) platform = "mercadolivre";
            return { url: m[2], label: m[1], price: 0, platform };
          });
        }
      }
    }
  }

  const heroImage = parsedContent?.hero_image || dbPost.hero_image || dbPost.heroImage || "https://images.unsplash.com/photo-1525785967371-87ba44b3e6cf";

  if (affiliateLinks.length === 0 && (parsedContent?.price_amazon || parsedContent?.price_ml)) {
    if (parsedContent.price_amazon) affiliateLinks.push({ url: parsedContent.price_amazon, label: "Ver na Amazon", price: 0, platform: "amazon" });
    if (parsedContent.price_ml) affiliateLinks.push({ url: parsedContent.price_ml, label: "Ver no Mercado Livre", price: 0, platform: "mercadolivre" });
  }

  const rawCat = dbPost.categories || dbPost.category || dbPost.Categories;
  const category = rawCat
    ? Array.isArray(rawCat)
      ? rawCat[0]
      : rawCat
    : {
        id: "unknown",
        name: "Sem Categoria",
        slug: "unknown",
        icon: "HelpCircle",
        description: "",
      };

  return {
    ...dbPost,
    excerpt,
    content: contentString,
    rating,
    pros,
    cons,
    affiliateLinks,
    heroImage,
    publishedAt: dbPost.published_at || dbPost.publishedAt || new Date().toISOString(),
    readingTime: dbPost.reading_time || dbPost.readingTime || 5,
    category: category,
  };
};

export const getPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`*, categories(*)`)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [{
      id: "error",
      title: "Erro no Supabase: " + error.message,
      excerpt: JSON.stringify(error),
      slug: "error",
      content: "Chaves env: " + Object.keys(import.meta.env).filter(k => k.includes("SUPABASE")).join(", ") + " | URL: " + import.meta.env.VITE_SUPABASE_URL,
      category_id: "error",
      category: { id: "err", name: "Erro", slug: "err", icon: "AlertTriangle", description: "" },
      tags: [],
      rating: 0,
      pros: [],
      cons: [],
      affiliate_links: [],
      hero_image: "https://images.unsplash.com/photo-1525785967371-87ba44b3e6cf",
      published_at: new Date().toISOString(),
      reading_time: 0,
      featured: true,
      status: "published",
      heroImage: "https://images.unsplash.com/photo-1525785967371-87ba44b3e6cf",
      publishedAt: new Date().toISOString(),
      readingTime: 0,
      affiliateLinks: [],
    }];
  }
  return data.map(mapPost);
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      categories:category_id (*)
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapPost(data);
};

export const deletePost = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("Error deleting post:", err);
    return { success: false, error: err };
  }
};

export const getPostsByCategory = async (categorySlug: string): Promise<Post[]> => {
  const { data: category } = await supabase.from("categories").select("id").eq("slug", categorySlug).single();
  if (!category) return [];

  const { data, error } = await supabase
    .from("posts")
    .select(`*, categories(*)`)
    .eq("category_id", category.id)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) return [];
  return data.map(mapPost);
};

export const getFeaturedPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`*, categories(*)`)
    .eq("featured", true)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) return [];
  return data.map(mapPost);
};

export const searchPosts = async (query: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`*, categories(*)`)
    .ilike("title", `%${query}%`)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) return [];
  return data.map(mapPost);
};

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) return [];
  return data;
};
