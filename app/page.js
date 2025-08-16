import BannerSlider from "./components/bannerslider/page";
import ProductsPage from "./products/page";
import ProductSlider from "./components/ProductSlider/page";
import StoriesSlider from "./components/storiesSlider/page";

// 🧠 دالة تجيب التصنيفات من WooCommerce
async function getCategories() {
  const auth = Buffer.from(`${process.env.WOO_CONSUMER_KEY}:${process.env.WOO_SECRET_KEY}`).toString("base64");

  const res = await fetch("https://furssati.io/wp-json/wc/v3/products/categories", {
    headers: { Authorization: `Basic ${auth}` },
  });

  const data = await res.json();
  return data.filter((cat) => cat.count > 0); // فقط التصنيفات اللي فيها منتجات
}

// 🧠 دالة تجيب المنتجات داخل تصنيف
async function getProductsByCategoryId(id) {
  const auth = Buffer.from(`${process.env.WOO_CONSUMER_KEY}:${process.env.WOO_SECRET_KEY}`).toString("base64");

  const res = await fetch(`https://furssati.io/wp-json/wc/v3/products?category=${id}`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: "no-store",
  });

  return await res.json();
}

export default async function Home() {
  const categories = await getCategories();

  const sliders = await Promise.all(
    categories.map(async (category) => {
      const products = await getProductsByCategoryId(category.id);
      return { category, products };
    })
  );

  return (
    <main>
      {/* <ToggleMenu/> */}
      <BannerSlider />
      <StoriesSlider />

      {/* سلايدر لكل تصنيف */}
      {sliders.map(({ category, products }) =>
        products.length > 0 ? (
          <ProductSlider
            key={category.id}
            category={category}
            products={products}
          />
        ) : null
      )}

      {/* <ProductsPage /> */}
    </main>
  );
}
