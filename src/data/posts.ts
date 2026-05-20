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
  category: Category;
  tags: string[];
  rating: number; // 0–10
  pros: string[];
  cons: string[];
  affiliateLinks: AffiliateLink[];
  heroImage: string;
  publishedAt: string;
  readingTime: number; // minutos
  featured: boolean;
};

export const CATEGORIES: Category[] = [
  {
    id: "eletronicos",
    name: "Eletrônicos",
    slug: "eletronicos",
    icon: "Cpu",
    description: "Smartphones, notebooks, fones e gadgets avaliados de verdade.",
  },
  {
    id: "casa-jardim",
    name: "Casa & Jardim",
    slug: "casa-jardim",
    icon: "Home",
    description: "Tudo para deixar sua casa mais prática e bonita.",
  },
  {
    id: "esporte-fitness",
    name: "Esporte & Fitness",
    slug: "esporte-fitness",
    icon: "Dumbbell",
    description: "Equipamentos e acessórios para seu treino.",
  },
  {
    id: "moda",
    name: "Moda",
    slug: "moda",
    icon: "Shirt",
    description: "Reviews honestos de roupas, calçados e acessórios.",
  },
  {
    id: "beleza",
    name: "Beleza & Cuidado",
    slug: "beleza",
    icon: "Sparkles",
    description: "Skincare, maquiagem e higiene pessoal.",
  },
  {
    id: "cozinha",
    name: "Cozinha",
    slug: "cozinha",
    icon: "ChefHat",
    description: "Utensílios, eletrodomésticos e tudo para cozinhar bem.",
  },
];

export const POSTS: Post[] = [
  {
    id: "1",
    slug: "fone-bluetooth-jbl-tune-520bt-review",
    title: "JBL Tune 520BT: Fone barato que realmente entrega",
    excerpt:
      "Testei o JBL Tune 520BT por 3 semanas no dia a dia. Spoiler: para o preço, é difícil reclamar.",
    content: `O JBL Tune 520BT chegou como minha aposta para fone custo-benefício e, após 3 semanas de uso intenso, posso dizer: entregou o prometido.

## Som

O driver de 40mm entrega um som com bastante grave — típico da JBL. Quem curte pop e rap vai amar. Para música clássica ou jazz, pode parecer um pouco excessivo, mas nada que incomode.

A equalização automática "Pure Bass Sound" funciona bem no volume médio. Acima de 80%, há um leve distorção nos agudos, mas é tolerável.

## Conforto

As almofadas de couro sintético são macias e o arco ajustável cobre cabeças maiores sem apertar. Usei por 4 horas seguidas sem desconforto.

## Bateria

A JBL promete 57 horas. Nos meus testes chegou a ~50 horas com volume moderado — ainda impressionante. A carga via USB-C enche em menos de 2 horas.

## Microfone

Funcional para chamadas no dia a dia, mas não é ponto forte. Em ambientes barulhentos, a outra pessoa vai precisar te pedir para repetir.

## Veredicto

Para quem quer um fone BT decente sem gastar muito, o Tune 520BT é uma escolha sólida. Não vai impressionar audiôfilos, mas para o uso cotidiano é excelente.`,
    category: CATEGORIES[0]!,
    tags: ["fone", "bluetooth", "jbl", "audio"],
    rating: 8.2,
    pros: [
      "Bateria de até 50h real",
      "Som encorpado com bom grave",
      "Carregamento USB-C",
      "Preço acessível",
      "Dobra facilmente para viagem",
    ],
    cons: [
      "Microfone mediano",
      "Sem cancelamento ativo de ruído",
      "Leve distorção no volume máximo",
    ],
    affiliateLinks: [
      {
        platform: "amazon",
        url: "https://www.amazon.com.br/dp/B0C5KH7KG7?tag=crivocerto-20",
        price: 259.9,
        label: "Ver na Amazon",
      },
      {
        platform: "mercadolivre",
        url: "https://www.mercadolivre.com.br/p/MLB29580384?partner=crivocerto",
        price: 249.9,
        label: "Ver no ML",
      },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    publishedAt: "2026-05-18",
    readingTime: 5,
    featured: true,
  },
  {
    id: "2",
    slug: "air-fryer-mondial-family-af-31-review",
    title: "Air Fryer Mondial Family AF-31: Vale os R$ 280?",
    excerpt:
      "Testei a air fryer mais vendida do Brasil por um mês inteiro. Resultado honesto aqui.",
    content: `A Mondial AF-31 é uma das air fryers mais vendidas do Brasil, e por bom motivo.

## Design e Construção

O visual é simples mas funcional. O corpo plástico parece robusto o suficiente. A gaveta desliza suave e o encaixe é firme. O painel analógico (temperatura + tempo) é intuitivo — zero curva de aprendizado.

## Desempenho

Testei batata frita, frango, peixe e até bolo. Os resultados:

- **Batata**: Dourada, crocante por fora, macia por dentro. Precisa virar na metade do tempo.
- **Frango**: Pele crocante mesmo sem óleo. Excelente.
- **Peixe**: Consistente, mas exige atenção ao tempo (facilmente passa do ponto).
- **Bolo**: Surpreendentemente bom para o tamanho.

A capacidade de 4,5L serve bem uma família de 4 pessoas, mas não para tudo de uma vez.

## Consumo

Especificada em 1400W, consumiu em média 0,7 kWh por hora de uso real — dentro do esperado.

## Limpeza

A cesta com revestimento antiaderente facilita muito. Em 90% das vezes, bastou agua e sabão sem esfregar.

## Veredicto

Para quem está entrando no mundo das air fryers, a Mondial AF-31 é um ótimo começo. Não é perfeita, mas entrega o essencial com confiabilidade.`,
    category: CATEGORIES[5]!,
    tags: ["air fryer", "cozinha", "mondial", "eletrodoméstico"],
    rating: 7.8,
    pros: [
      "Custo-benefício excelente",
      "Fácil de usar (controle analógico)",
      "Boa capacidade (4,5L)",
      "Fácil de limpar",
      "Compacta",
    ],
    cons: [
      "Sem visor digital preciso",
      "Nível de ruído acima da média",
      "Sem função shake/vira automático",
    ],
    affiliateLinks: [
      {
        platform: "amazon",
        url: "https://www.amazon.com.br/dp/B08FQZL2FH?tag=crivocerto-20",
        price: 279.9,
        label: "Ver na Amazon",
      },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
    publishedAt: "2026-05-15",
    readingTime: 6,
    featured: true,
  },
  {
    id: "3",
    slug: "tenis-olympikus-athlon-review",
    title: "Olympikus Athlon: O tênis de corrida nacional que surpreende",
    excerpt:
      "Testamos o Olympikus Athlon em 120km de corrida. Custo-benefício ou cilada?",
    content: `O mercado de tênis de corrida é dominado por marcas importadas, mas o Olympikus Athlon tenta mudar isso.

## Conforto e Ajuste

O cabedal em mesh respirável mantém o pé fresco mesmo em corridas longas. O ajuste é mediano — pés mais largos podem sentir aperto nas bordas.

## Amortecimento

A entressola com tecnologia OlyFoam oferece amortecimento adequado para treinos leves e médios. Não substituirá um tênis premium para maratonas, mas para treinos de até 10km é competente.

## Durabilidade

Após 120km, a sola mostrou desgaste normal e o upper está intacto. Para o preço, a durabilidade é boa.

## Veredicto

Para quem quer entrar no mundo da corrida sem gastar R$ 600+, o Athlon é uma opção honesta e nacional.`,
    category: CATEGORIES[2]!,
    tags: ["tênis", "corrida", "olympikus", "fitness"],
    rating: 7.5,
    pros: [
      "Preço acessível (R$ 180-220)",
      "Fabricado no Brasil",
      "Bom amortecimento básico",
      "Respirável",
    ],
    cons: [
      "Ajuste mediano para pés largos",
      "Amortecimento não é para maratonas",
      "Drop alto pode não agradar todos",
    ],
    affiliateLinks: [
      {
        platform: "amazon",
        url: "https://www.amazon.com.br/dp/B09XXXXX?tag=crivocerto-20",
        price: 199.9,
        label: "Ver na Amazon",
      },
      {
        platform: "mercadolivre",
        url: "https://www.mercadolivre.com.br/p/MLB20000001?partner=crivocerto",
        price: 189.9,
        label: "Ver no ML",
      },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    publishedAt: "2026-05-10",
    readingTime: 4,
    featured: false,
  },
  {
    id: "4",
    slug: "hidratante-neutrogena-hydro-boost-review",
    title: "Neutrogena Hydro Boost: O hidratante que virou culto (e merece?)",
    excerpt:
      "Testamos o Hydro Boost por 60 dias em pele oleosa, mista e seca. Resultados reais aqui.",
    content: `O Neutrogena Hydro Boost é talvez o hidratante facial mais recomendado da internet brasileira. Mas será que merece o hype?

## Textura e Absorção

O gel-water é leve e absorve rapidinho — ideal para quem tem pele oleosa e odeia aquela sensação grudenta. Em 30 segundos já estava seco ao toque.

## Hidratação

O ácido hialurônico faz seu trabalho. Após 4 semanas de uso diário, a pele ficou visivelmente mais plump e as linhas finas suavizadas.

## Para pele oleosa

Boa notícia: não pegou oleosidade nem entupiu poros. Usei em clima úmido e quente sem problemas.

## Para pele seca

Funciona bem para hidratação leve/média. Peles muito ressecadas podem precisar de um produto mais oclusivo por cima.

## Veredicto

Merece o hype? Sim, para a maioria dos tipos de pele. A relação custo-benefício é excelente.`,
    category: CATEGORIES[4]!,
    tags: ["skincare", "hidratante", "neutrogena", "beleza"],
    rating: 8.8,
    pros: [
      "Textura ultra leve",
      "Sem oleosidade",
      "Hidrata de verdade",
      "Fragrance-free",
      "Preço acessível",
    ],
    cons: [
      "Pode não ser suficiente para pele muito seca",
      "Embalagem pouco sustentável",
    ],
    affiliateLinks: [
      {
        platform: "amazon",
        url: "https://www.amazon.com.br/dp/B00NR1YQK4?tag=crivocerto-20",
        price: 72.9,
        label: "Ver na Amazon",
      },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    publishedAt: "2026-05-08",
    readingTime: 5,
    featured: true,
  },
  {
    id: "5",
    slug: "xiaomi-redmi-note-13-review",
    title: "Redmi Note 13 4G: Smartphone completo por menos de R$ 900",
    excerpt:
      "Testamos o intermediário da Xiaomi por 30 dias. Câmera, bateria, desempenho — tudo aqui.",
    content: `O Redmi Note 13 4G é a aposta da Xiaomi para quem quer um bom smartphone sem gastar muito.

## Design

Tela AMOLED de 6,67" com refresh rate de 120Hz — isso já era premium há 2 anos. O acabamento em vidro fosco tem tato premium e não marca impressão digital facilmente.

## Câmera

O sensor principal de 108MP entrega fotos detalhadas com boa luz. Em ambientes escuros, o resultado é ok — não compete com flagships, mas supera a maioria dos intermediários.

Câmera frontal de 16MP: selfies nítidas com HDR natural.

## Desempenho

O Snapdragon 685 é suficiente para o dia a dia: redes sociais, streaming, WhatsApp. Para jogos pesados (Genshin no máximo), espere quedas de frame.

## Bateria

5000mAh com carregamento de 33W. No meu uso (5h de tela/dia), chegava ao final do dia com 20-30% restantes. Carregamento completo em ~75 minutos.

## Veredicto

Melhor custo-benefício no segmento abaixo de R$ 900. Difícil achar algo mais completo nesse preço.`,
    category: CATEGORIES[0]!,
    tags: ["smartphone", "xiaomi", "android", "celular"],
    rating: 8.5,
    pros: [
      "Tela AMOLED 120Hz excelente",
      "Câmera de 108MP surpreende",
      "Bateria para o dia todo",
      "Design premium no segmento",
      "Preço ótimo",
    ],
    cons: [
      "Apenas 4G",
      "Desempenho médio em jogos pesados",
      "MIUI pode incomodar quem prefere Android puro",
    ],
    affiliateLinks: [
      {
        platform: "amazon",
        url: "https://www.amazon.com.br/dp/B0CN9XXXXX?tag=crivocerto-20",
        price: 879.9,
        label: "Ver na Amazon",
      },
      {
        platform: "mercadolivre",
        url: "https://www.mercadolivre.com.br/p/MLB3000001?partner=crivocerto",
        price: 849.9,
        label: "Ver no ML",
      },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    publishedAt: "2026-05-05",
    readingTime: 7,
    featured: true,
  },
  {
    id: "6",
    slug: "luminaria-led-inteligente-positivo-review",
    title: "Lâmpada Inteligente Positivo Smart: Casa conectada sem gastar muito",
    excerpt:
      "Testamos a lâmpada smart mais barata do mercado. Funciona com Alexa e Google? Sim.",
    content: `Automatizar sua casa ficou mais acessível com as lâmpadas smart brasileiras. Testamos a Positivo Smart LED por um mês.

## Instalação

Encaixe E27 padrão. Baixar o app Smart Life, escanear QR e pronto — 3 minutos do início ao fim.

## Compatibilidade

Funciona com Alexa e Google Assistant sem problemas. "Alexa, apaga a sala" funciona consistentemente.

## Qualidade de Luz

Temperatura ajustável de 2700K a 6500K (quente a frio). Os 800 lumens são suficientes para ambientes de até 12m².

## App

O Smart Life é funcional mas não bonito. Rotinas e agendamentos funcionam bem. A integração com a Alexa é o ponto forte.

## Veredicto

Para quem quer entrar em automação residencial gastando pouco, é o começo ideal.`,
    category: CATEGORIES[1]!,
    tags: ["casa inteligente", "lâmpada", "smart home", "automação"],
    rating: 7.6,
    pros: [
      "Preço muito acessível",
      "Integração fácil com Alexa/Google",
      "Temperatura de cor ajustável",
      "Instalação rápida",
    ],
    cons: [
      "App poderia ser mais bonito",
      "Requer Wi-Fi 2.4GHz",
      "Sem opção RGB",
    ],
    affiliateLinks: [
      {
        platform: "amazon",
        url: "https://www.amazon.com.br/dp/B09SXXXXX?tag=crivocerto-20",
        price: 39.9,
        label: "Ver na Amazon",
      },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    publishedAt: "2026-05-02",
    readingTime: 4,
    featured: false,
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return POSTS.filter((p) => p.category.slug === categorySlug);
}

export function getFeaturedPosts(): Post[] {
  return POSTS.filter((p) => p.featured);
}

export function searchPosts(query: string): Post[] {
  const q = query.toLowerCase();
  return POSTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
  );
}
