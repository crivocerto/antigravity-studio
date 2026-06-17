import { ExternalLink } from "lucide-react";

interface ProductProps {
  id: string;
  title: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
  affiliateUrl: string;
  store: string;
}

export function ProductCard({ id, title, originalPrice, discountPrice, imageUrl, affiliateUrl, store }: ProductProps) {
  const discountPercent = Math.round((1 - discountPrice / originalPrice) * 100);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const redirectUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/go?id=${id}` : affiliateUrl;

  return (
    <a 
      href={redirectUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col group relative"
    >
      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-sm">
        -{discountPercent}%
      </div>
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
