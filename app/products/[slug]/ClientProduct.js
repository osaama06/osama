'use client';

import React, { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import '@/styles/productpage.css';

export default function ClientProduct({ product, variations }) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.src);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariationId, setSelectedVariationId] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const hasSizes = product.attributes?.some(attr => attr.name === 'المقاس' || attr.name.toLowerCase().includes("size"));
  const sizes = hasSizes
    ? product.attributes.find(attr => attr.name === 'المقاس' || attr.name.toLowerCase().includes("size")).options
    : [];

  const handleSizeChange = (size) => {
    setSelectedSize(size);

    const match = variations.find(v =>
      v.attributes.some(attr =>
        attr.name.toLowerCase().includes("size") &&
        attr.option === size
      )
    );

    setSelectedVariationId(match ? match.id : null);
  };

  const handleAddToCart = () => {
    if (hasSizes && !selectedVariationId) {
      setShowError(true);
      return;
    }

    setShowError(false);

    addToCart({
      id: selectedVariationId || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.src,
      size: selectedSize || null,
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="page">
      {showToast && (
        <div className="toast">
          ✅ تمت إضافة المنتج إلى السلة
        </div>
      )}

      <div className="imageSection">
        <img
          src={selectedImage}
          alt={product.name}
          className="mainImage"
        />
        <div className="thumbnailList">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={`image-${i}`}
              className="thumbnail"
              onClick={() => setSelectedImage(img.src)}
            />
          ))}
        </div>
      </div>

      <div className="details">
        <h1 className="title">{product.name}</h1>

        <div className="rating">
          ⭐⭐⭐⭐☆ <span className="reviewCount">(20 تقييم)</span>
        </div>

        <p className="price">السعر: {product.price} ريال</p>

        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        ></div>

        {hasSizes && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontWeight: 'bold' }}>اختر المقاس:</p>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              {sizes.map((size, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name="size"
                    value={size}
                    checked={selectedSize === size}
                    onChange={() => handleSizeChange(size)}
                  />{" "}
                  {size}
                </label>
              ))}
            </div>
            {showError && <p style={{ color: "red", marginTop: "10px" }}>⚠️ يجب اختيار المقاس</p>}
          </div>
        )}

        <button className="button" onClick={handleAddToCart}>🛒 أضف إلى السلة</button>
      </div>
    </div>
  );
}
