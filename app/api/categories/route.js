// app/api/categories/route.js
export async function GET() {
    const auth = Buffer.from(`${process.env.WOO_CONSUMER_KEY}:${process.env.WOO_SECRET_KEY}`).toString("base64");

    const res = await fetch(
      "https://furssati.io/wp-json/wc/v3/products/categories",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    const data = await res.json();
    return Response.json(data);
  }
