// app/category/[slug]/page.js
import ProductCard from "@/app/productCard/page";
import "@/styles/products-grid.css";


async function getCategoryBySlug(slug) {
    const auth = Buffer.from(`${process.env.WOO_CONSUMER_KEY}:${process.env.WOO_SECRET_KEY}`).toString("base64");

    const res = await fetch(
      "https://furssati.io/wp-json/wc/v3/products/categories",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    const categories = await res.json();
    return categories.find((cat) => cat.slug === slug);
  }

  async function getProductsByCategoryId(id) {
    const auth = Buffer.from(`${process.env.WOO_CONSUMER_KEY}:${process.env.WOO_SECRET_KEY}`).toString("base64");

    const res = await fetch(
      `https://furssati.io/wp-json/wc/v3/products?category=${id}`,
      {
        headers: { Authorization: `Basic ${auth}` },
        cache: "no-store",
      }
    );

    return await res.json();
  }

  export default async function CategoryPage({ params }) {
    const category = await getCategoryBySlug(params.slug);

    if (!category) return <div>التصنيف غير موجود</div>;

    const products = await getProductsByCategoryId(category.id);

    return (
<main className="products-page">
  <h1>منتجات {category.name}</h1>

  {products.length === 0 ? (
    <p className="no-products">لا توجد منتجات</p>
  ) : (
    <div className="products-grid">
      {products.map((product) => (
        <div className="product-wrapper" key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )}
</main>


    );
  }
