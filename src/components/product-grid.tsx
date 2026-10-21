import type { Product } from '@/data/products';
import { ProductCard } from '@/components/product-card';

export function ProductGrid({
  products,
  className = '',
  priorityCount = 0,
}: {
  products: Product[];
  className?: string;
  priorityCount?: number;
}) {
  return (
    <div className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${className}`}>
      {products.map((product, index) => (
        <ProductCard key={product.slug} product={product} priority={index < priorityCount} />
      ))}
    </div>
  );
}
