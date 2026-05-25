import { supabase } from "@/lib/supabase";

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
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
  category?: Category; // Populado via join
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
};

// Como o front-end mapeava propriedades em camelCase (affiliateLinks) 
// e o banco tá em snake_case (affiliate_links), criamos um helper.
const mapPost = (dbPost: any): Post => {
  return {
    ...dbPost,
    affiliateLinks: dbPost.affiliate_links,
    heroImage: dbPost.hero_image,
    publishedAt: dbPost.published_at,
    readingTime: dbPost.reading_time,
    category: dbPost.categories
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
    return [];
  }
  return data.map(mapPost);
};

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`*, categories(*)`)
    .eq("slug", slug)
    .single();

  if (error || !data) return undefined;
  return mapPost(data);
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
