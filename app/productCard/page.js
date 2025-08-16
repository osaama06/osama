'use client';
import Image from "next/image";
import { useState } from "react";
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import '@/styles/ProductCard.css';

export default function DynamicProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [liked, setLiked] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  if (!product) {
    return <div className="no-product">لا توجد بيانات للمنتج</div>;
  }

  // فحص وجود المقاسات
  const hasSizes = product.attributes?.some(attr =>
    attr.name.toLowerCase().includes("size") || attr.name === "المقاس"
  );

  const sizes = hasSizes
    ? product.attributes.find(attr =>
        attr.name.toLowerCase().includes("size") || attr.name === "المقاس"
      )?.options || []
    : [];

  // حساب نسبة الخصم
  const calculateDiscount = () => {
    if (product.regular_price && product.sale_price) {
      const regular = parseFloat(product.regular_price);
      const sale = parseFloat(product.sale_price);
      return Math.round(((regular - sale) / regular) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();
  const finalPrice = product.sale_price || product.price || product.regular_price;
  const originalPrice = product.regular_price;

  // بيانات التقييم من API
  const averageRating = product.average_rating || 0;
  const totalReviews = product.rating_count || 0;

  const handleSizeSelect = (size, e) => {
    e.stopPropagation(); // منع انتشار الحدث للبطاقة الأساسية
    setSelectedSize(size);
    setShowSizeError(false);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // منع انتشار الحدث للبطاقة الأساسية

    if (hasSizes && !selectedSize) {
      setShowSizeError(true);
      return;
    }

    setShowSizeError(false);

    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.images?.[0]?.src,
      size: selectedSize || null,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleLike = (e) => {
    e.stopPropagation(); // منع انتشار الحدث للبطاقة الأساسية
    setLiked(!liked);
    // يمكن إضافة API call هنا لحفظ المفضلة
  };

  const handleCardClick = () => {
    // الانتقال إلى صفحة المنتج
    router.push(`/products/${product.slug}`);
  };

  return (
    <div
      className="dynamic-product-card clickable-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      {/* شارة الخصم */}
      {discount > 0 && (
        <div className="discount-badge">
          -{discount}%
        </div>
      )}

      {/* حاوية الصورة */}
      <div className="image-container">
        {/* الصورة الرئيسية */}
        <div className="image-wrapper">
          <Image
            src={product.images?.[0]?.src || "/placeholder.jpg"}
            alt={product.name || "Product"}
            width={400}
            height={400}
            className="product-image"
          />
        </div>


        {/* شارات المميزات */}
        {/* <div className="feature-badges">
          <div className="feature-badge">
            <span>توصيل سريع</span>
          </div>
          <div className="feature-badge">
            <span>ضمان</span>
          </div>
        </div> */}
      </div>

      {/* محتوى البطاقة */}
      <div className="card-content">
        {/* اسم المنتج */}
        <h3 className="product-name">{product.name}</h3>

        {/* التقييمات */}
        <div className="rating-section">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`star ${i < Math.floor(averageRating) ? 'filled' : 'empty'}`}
              >
                ★
              </span>
            ))}
            <span className="rating-value">{averageRating}</span>
          </div>
          <span className="review-count">({totalReviews})</span>
        </div>

        {/* الأسعار */}
        <div className="price-section">
          <div className="price-container">
            <div className="current-price">
              {finalPrice} <span className="currency">ر.س</span>
            </div>
            {originalPrice && product.sale_price && (
              <div className="original-price">
                {originalPrice} ر.س
              </div>
            )}
          </div>

          {/* المميزات */}
          {/* <div className="features">
            <div className="feature">
              <span>توصيل مجاني</span>
            </div>
            <div className="feature">
              <span>تسليم سريع</span>
            </div>
          </div> */}
        </div>

        {/* المقاسات - دوائر */}
        {hasSizes && (
          <div className="sizes-section">
            <div className="sizes-label">
              <span>المقاس</span>
              {selectedSize && <span className="selected-size">({selectedSize})</span>}
            </div>
            <div className="sizes-grid">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleSizeSelect(size, e)}
                  className={`size-circle ${selectedSize === size ? 'selected' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
            {showSizeError && (
              <p className="size-error">⚠️ يرجى اختيار المقاس</p>
            )}
          </div>
        )}

        {/* زر الإضافة للسلة */}
        <button
          className={`add-to-cart-btn ${added ? 'added' : ''} ${(hasSizes && !selectedSize) ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={hasSizes && !selectedSize}
        >
          <FiShoppingCart className="cart-icon" />
          <span>{added ? 'تمت الإضافة ✨' : 'أضف إلى السلة'}</span>
        </button>
      </div>

      {/* تأثير التوهج */}
      <div className="glow-effect"></div>
    </div>
  );
}