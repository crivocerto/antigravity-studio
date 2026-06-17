import * as fs from "fs";

// Dados estáticos extraídos manualmente para evitar erro de importação devido a restrições do Bun com TS.
const CATEGORIES = [
  { id: "eletronicos", name: "Eletrônicos", slug: "eletronicos", icon: "Cpu", description: "Smartphones, notebooks, fones e gadgets avaliados de verdade." },
  { id: "casa-jardim", name: "Casa & Jardim", slug: "casa-jardim", icon: "Home", description: "Tudo para deixar sua casa mais prática e bonita." },
  { id: "esporte-fitness", name: "Esporte & Fitness", slug: "esporte-fitness", icon: "Dumbbell", description: "Equipamentos e acessórios para seu treino." },
  { id: "moda", name: "Moda", slug: "moda", icon: "Shirt", description: "Reviews honestos de roupas, calçados e acessórios." },
  { id: "beleza", name: "Beleza & Cuidado", slug: "beleza", icon: "Sparkles", description: "Skincare, maquiagem e higiene pessoal." },
  { id: "cozinha", name: "Cozinha", slug: "cozinha", icon: "ChefHat", description: "Utensílios, eletrodomésticos e tudo para cozinhar bem." }
];

// Omitindo conteúdo completo de posts para a geração do banco. Mas deixarei alguns simulados para não sujar muito o código do gerador.
// O correto é importar o POSTS.
import { POSTS } from "./src/data/posts.ts";

let sql = `
-- Tabela de Categorias
CREATE TABLE public.categories (
    id text PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    icon text,
    description text
);

-- Tabela de Posts
CREATE TABLE public.posts (
    id text PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    excerpt text,
    content text,
    category_id text REFERENCES public.categories(id) ON DELETE SET NULL,
    tags text[] DEFAULT '{}',
    rating numeric DEFAULT 0,
    pros text[] DEFAULT '{}',
    cons text[] DEFAULT '{}',
    affiliate_links jsonb DEFAULT '[]'::jsonb,
    hero_image text,
    published_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    reading_time integer DEFAULT 5,
    featured boolean DEFAULT false,
    status text DEFAULT 'published'
);

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Políticas Públicas de Leitura
CREATE POLICY "Public pode ler categorias" ON public.categories FOR SELECT TO public USING (true);
CREATE POLICY "Public pode ler posts" ON public.posts FOR SELECT TO public USING (true);

-- Políticas de Escrita para Admins (authenticated)
CREATE POLICY "Admins gerenciam categorias" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins gerenciam posts" ON public.posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SEED DAS CATEGORIAS
INSERT INTO public.categories (id, name, slug, icon, description) VALUES
`;

const catValues = CATEGORIES.map(c => `('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.slug}', '${c.icon}', '${c.description.replace(/'/g, "''")}')`).join(",\n");
sql += catValues + ";\n\n";

sql += `-- SEED DOS POSTS\nINSERT INTO public.posts (id, slug, title, excerpt, content, category_id, tags, rating, pros, cons, affiliate_links, hero_image, published_at, reading_time, featured) VALUES\n`;

const postValues = POSTS.map(p => {
  const escapeStr = (s: string) => s ? s.replace(/'/g, "''") : "";
  const formatArray = (arr: string[]) => `ARRAY[${arr.map(a => `'${escapeStr(a)}'`).join(", ")}]`;
  return `(
    '${p.id}',
    '${p.slug}',
    '${escapeStr(p.title)}',
    '${escapeStr(p.excerpt)}',
    '${escapeStr(p.content)}',
    '${p.category.id}',
    ${formatArray(p.tags)},
    ${p.rating},
    ${formatArray(p.pros)},
    ${formatArray(p.cons)},
    '${JSON.stringify(p.affiliateLinks).replace(/'/g, "''")}'::jsonb,
    '${p.heroImage}',
    '${p.publishedAt}',
    ${p.readingTime},
    ${p.featured}
  )`;
}).join(",\n");

sql += postValues + ";\n";

fs.writeFileSync("./supabase/migrations/20260525121800_create_posts_and_categories.sql", sql);
console.log("Migration gerada com sucesso!");
