

// lib/woocommerce.js
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
console.log("WOO_URL:", process.env.WOO_URL);
const woocommerceApi = new WooCommerceRestApi({
  url: process.env.WOO_URL,
  consumerKey: process.env.WOO_CONSUMER_KEY,
  consumerSecret: process.env.WOO_SECRET_KEY,
  version: "wc/v3"
});

export default woocommerceApi;
