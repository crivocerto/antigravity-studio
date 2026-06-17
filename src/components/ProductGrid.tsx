import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  title: string;
  original_price: number;
  discount_price: number;
  image_url: string;
  affiliate_url: string;
  store: string;
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhuma oferta encontrada no momento.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 p-3 md:p-4 max-w-5xl mx-auto">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          originalPrice={product.original_price}
          discountPrice={product.discount_price}
          imageUrl={product.image_url}
          affiliateUrl={product.affiliate_url}
          store={product.store}
        />
      ))}
    </div>
  );
}
