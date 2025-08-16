const consumerKey = process.env.WOO_CONSUMER_KEY;
const secretKey = process.env.WOO_SECRET_KEY;

const baseUrl = "https://furssati.io/wp-json/wc/v3";

// 🔐 إعداد التوثيق Basic Auth
const auth = Buffer.from(`${consumerKey}:${secretKey}`).toString("base64");

// 📦 جلب المنتجات
export async function getProducts() {
  const res = await fetch(`${baseUrl}/products?status=publish&per_page=100`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("فشل في جلب المنتجات");
  return res.json();
}

// 🔎 البحث عن المنتجات باستخدام الكلمة المفتاحية
export async function searchProducts(query) {
  const res = await fetch(`${baseUrl}/products?search=${query}`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("فشل في جلب نتائج البحث");
  return res.json();
}

// 📂 جلب التصنيفات
export async function getCategories() {
  const res = await fetch(`${baseUrl}/products/categories`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("فشل في جلب التصنيفات");
  return res.json();
}



export async function createAnOrder(orderData) {
  try {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || 'فشل إنشاء الطلب');
    }

    return data;
  } catch (error) {
    throw error;
  }
}
