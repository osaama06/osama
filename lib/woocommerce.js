// lib/woocommerce.js
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// التحقق من وجود متغيرات البيئة
const verifyEnvVariables = () => {
  const requiredVars = ["WOO_URL", "WOO_CONSUMER_KEY", "WOO_SECRET_KEY"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }

  if (!process.env.WOO_URL.startsWith("http")) {
    throw new Error("WOO_URL must start with http:// or https://");
  }
};

let woocommerceApi;

try {
  verifyEnvVariables();

  woocommerceApi = new WooCommerceRestApi({
    url: process.env.WOO_URL,
    consumerKey: process.env.WOO_CONSUMER_KEY,
    consumerSecret: process.env.WOO_SECRET_KEY,
    version: "wc/v3",
    queryStringAuth: true,
    axiosConfig: {
      timeout: 10000,
      headers: {
        "Accept-Encoding": "gzip,deflate,compress",
      },
    },
  });

  // دالة مساعدة للتحقق من الاتصال
  woocommerceApi.testConnection = async () => {
    try {
      const response = await woocommerceApi.get("products", {
        per_page: 1,
        status: "publish",
      });
      return response.status === 200;
    } catch (error) {
      console.error("Connection test failed:", error.message);
      return false;
    }
  };
} catch (error) {
  console.error("Failed to initialize WooCommerce API:", error.message);

  // تصدير نسخة وهمية للاستخدام في التطوير أو عند فشل الاتصال
  woocommerceApi = {
    get: () => Promise.reject(error),
    post: () => Promise.reject(error),
    put: () => Promise.reject(error),
    delete: () => Promise.reject(error),
    testConnection: () => Promise.resolve(false),
  };
}

export default woocommerceApi;
