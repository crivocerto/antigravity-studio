import { ExternalLink } from "lucide-react";

interface ProductProps {
  id: string;
  title: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
  affiliateUrl: string;
  store: string;
  isViral?: boolean;
}

export function ProductCard({ id, title, originalPrice, discountPrice, imageUrl, affiliateUrl, store, isViral }: ProductProps) {
  const discountPercent = Math.round((1 - discountPrice / originalPrice) * 100);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const redirectUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/go?id=${id}` : affiliateUrl;

  return (
    <a 
      href={redirectUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col group relative"
    >
      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-sm">
        -{discountPercent}%
      </div>
      {isViral && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] uppercase font-black tracking-wider px-2 py-1 rounded-md z-10 shadow-[0_0_10px_rgba(249,115,22,0.4)] animate-pulse flex items-center gap-1 border border-white/20 backdrop-blur-sm">
          🔥 Em Alta
        </div>
      )}
      <div className="relative aspect-square bg-white p-2 flex items-center justify-center overflow-hidden border-b border-slate-50">
        <img 
          src={imageUrl} 
          alt={title} 
          className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 flex flex-col flex-grow gap-1">
        <h3 className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">{title}</h3>
        <div className="mt-auto pt-2 flex flex-col">
          <span className="text-xs text-slate-400 line-through">De R$ {originalPrice.toFixed(2).replace('.', ',')}</span>
          <span className="text-lg font-black text-orange-500 leading-none">
            <span className="text-sm font-bold mr-1">R$</span>{discountPrice.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <button className="mt-3 w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white text-sm font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
          Ver na Loja <ExternalLink size={14} />
        </button>
      </div>
    </a>
  );
}
