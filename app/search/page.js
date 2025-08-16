// app/search/page.jsx

import { searchProducts } from '@/lib/api';
import ProductCard from '../productCard/page';
import "@/styles/products-grid.css";


export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || '';
  const products = query ? await searchProducts(query) : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">نتائج البحث عن: {query}</h1>
      {products.length === 0 ? (
        <p>لا توجد منتجات مطابقة.</p>
      ) : (
<div className="products-grid">
  {products.map((product) => (
    <div className="product-item" key={product.id}>
      <ProductCard product={product} />
    </div>
  ))}
</div>

      )}
    </div>
  );
}
