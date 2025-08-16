'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import '@/styles/ProductCard.css';

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();

  if (!product) {
    return <div>لا توجد بيانات للمنتج</div>;
  }

  // 🔍 فحص وجود المقاسات
  const hasSizes = product.attributes?.some(attr =>
    attr.name === 'المقاس' || attr.name.toLowerCase().includes("size")
  );

  const sizes = hasSizes
    ? product.attributes.find(attr =>
        attr.name === 'المقاس' || attr.name.toLowerCase().includes("size")
      )?.options || []
    : [];

  const handleAdd = () => {
    if (hasSizes && !selectedSize) {
      alert("⚠️ يرجى اختيار المقاس أولاً");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.src,
      size: hasSizes ? selectedSize : null,
    });

    setAdded(true);
  };

  return (
    <div className="product-card">
      <Link href={`/products/${product.slug}`} className="product-card-link">
        <Image
          src={product.images?.[0]?.src || "/placeholder.jpg"}
          alt={product.name || "Product"}
          width={300}
          height={300}
        />
        <h3 className="product-name">{product.name}</h3>

        {/* 🟨 مكان التقييمات - استبدلناه بالمقاسات */}
        {hasSizes && (
          <select
            className="size-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">اختر المقاس</option>
            {sizes.map((size, index) => (
              <option key={index} value={size}>{size}</option>
            ))}
          </select>
        )}

        <p className="price">{product.price} {product.currency || "ر.س"}</p>
        <p className="shipping">✔ توصيل مجاني</p>
      </Link>

      <button
        className={`add-to-cart-btn ${added ? 'added' : ''}`}
        onClick={handleAdd}
      >
        <FiShoppingCart className="cart-icon" />
        {added ? 'تمت الإضافة' : 'أضف إلى السلة'}
      </button>
    </div>
  );
}